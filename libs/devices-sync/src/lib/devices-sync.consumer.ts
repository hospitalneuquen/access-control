import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Processor, Process } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { DevicesService, Device } from '@access-control/devices';
import { AgentesService } from '@access-control/agentes';
import { HikVisionDevice } from '@access-control/devices-adapter/hikvision';
import { SQLServerConfig, SQLServerExport } from '@access-control/ac-plugin-sqlserver';
import { DEVICE_EVENTS_MODEL_TOKEN } from './device-events/device-events.schema';
import { DeviceEvents } from './device-events/device-events.interface';
import { sub } from 'date-fns';

export interface JobDevicesAgentSyncData {
    deviceId: string;
    agenteId: string;
}

export interface JobDeviceEventsSyncData {
    deviceId: string;
    startTime: string;
    endTime: string;
}

export const DEVICE_SYNC_QUEUE = 'devices-sync';
export const DEVICE_AGENT_SYNC_JOB = 'devices-agent-sync';
export const DEVICE_EVENTS_SYNC_JOB = 'devices-events-sync';

@Processor(DEVICE_SYNC_QUEUE)
export class DevicesSyncConsumer {
    private readonly logger = new Logger(DevicesSyncConsumer.name);

    private HOST = '';

    constructor(
        private devicesService: DevicesService,
        private agenteService: AgentesService,
        private configService: ConfigService,
        @InjectModel(DEVICE_EVENTS_MODEL_TOKEN) private readonly deviceEventsModel: Model<DeviceEvents>
    ) {
        this.HOST = this.configService.get('APP_HOST');
    }

    private async getDeviceAndCliente(deviceId: string): Promise<[Device, HikVisionDevice]> {
        const device = await this.devicesService.findById(deviceId);
        if (!device) {
            return null;
        }
        const deviceClient = new HikVisionDevice(device);
        return [device, deviceClient];
    }

    @Process(DEVICE_AGENT_SYNC_JOB)
    async sync(job: Job<JobDevicesAgentSyncData>) {
        const { deviceId, agenteId } = job.data;

        const device = await this.devicesService.findById(deviceId);
        if (!device) {
            return null;
        }
        const deviceClient = new HikVisionDevice(device);
        const agente = await this.agenteService.findById(agenteId);

        if (!agente) {
            return null;
        }
        this.logger.debug(`Sync ${agente.nombre} -> ${device.id}`);

        await deviceClient.deleteUser(agente.id);


        const r = await deviceClient.addUser({
            id: agente.id,
            name: agente.nombre
        });

        const r2 = await deviceClient.addPhoto({
            id: agente.id,
            name: agente.nombre,
            url: `${this.HOST}/api/images/${agente.foto}.jpeg`
        });

        if (!agente.devices.find(id => String(id) === String(device.id))) {
            agente.devices.push(device.id);
        }

        await agente.save();

        return true;
    }

    @Process(DEVICE_EVENTS_SYNC_JOB)
    async deviceEventProcess(job: Job<JobDeviceEventsSyncData>) {
        const { deviceId, startTime, endTime } = job.data;
        const start = new Date(startTime);
        const end = new Date(endTime);
        const [device, client] = await this.getDeviceAndCliente(deviceId);

        this.logger.debug(`sync events ${deviceId} from ${startTime} to ${endTime}`);

        const eventos: DeviceEventDTO[] = await client.getEvents(start, end);
        for (const evt of eventos) {
            const ok = await this.createEvent(device, evt);
            if (ok) {
                await this.exportSql(device, evt);
            }
        }

        await this.devicesService.updateLastSync(device, end);
    }

    private getSQLServer() {
        const config: SQLServerConfig = {
            server: this.configService.get('SQLSERVER_HOST'),
            port: parseInt(this.configService.get('SQLSERVER_PORT') || '1434', 10),
            user: this.configService.get('SQLSERVER_USER'),
            password: this.configService.get('SQLSERVER_PASSWORD'),
            database: this.configService.get('SQLSERVER_DATABASE')
        };
        return new SQLServerExport(config);
    }

    async exportSql(device: Device, item: DeviceEventDTO) {
        const entradaTag = device.tags.includes('entrada');
        const salidaTag = device.tags.includes('salida');

        let esEntrada = entradaTag;

        if (entradaTag && salidaTag) {
            if (item.attendanceStatus === 'checkIn' || item.attendanceStatus === 'checkOut') {
                esEntrada = item.attendanceStatus === 'checkIn';
            } else {
                this.logger.error(`device ${device.id} tiene entra y salida como tag`);
                return;
            }
        }

        if (!entradaTag && !salidaTag) {
            this.logger.error(`device ${device.id} no esta identificado como entrada o salida`);
            return;
        }

        const agente = await this.agenteService.findById(item.agenteId);
        if (!agente) {
            this.logger.error(`agente ${item.agenteId} no encontrado`);
            return;
        }
        const identificador = agente.identificadores.find((ident) => ident.startsWith('rrhh-legacy'));
        const id = parseInt(identificador.substring(12), 10);


        const sqlExport = this.getSQLServer();
        const personalTable = this.configService.get('SQLSERVER_TABLE');

        const fecha = sub(new Date(item.datetime), { hours: 3 });

        const dto = {
            idAgente: id,
            fecha,
            esEntrada: esEntrada,
            reloj: 32
        };

        await sqlExport.insert(personalTable, dto);
    }

    async createEvent(device: Device, item: DeviceEventDTO) {
        if (!Types.ObjectId.isValid(item.agenteId)) {
            return false;
        }
        const op = await this.deviceEventsModel.updateOne(
            {
                deviceId: device.id,
                agenteId: Types.ObjectId(item.agenteId),
                datetime: new Date(item.datetime)
            },
            {
                $inc: { count: 1 },
                $setOnInsert: {
                    deviceId: device.id,
                    agenteId: Types.ObjectId(item.agenteId),
                    datetime: new Date(item.datetime),
                    tags: device.tags,
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );
        return op.nModified === 0;
    }
}

interface DeviceEventDTO {
    agenteId: string;
    datetime: string;
    url: string;
    attendanceStatus?: string;
}
