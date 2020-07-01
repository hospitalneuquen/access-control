import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DevicesService, Device } from '@access-control/devices';
import { HikVisionDevice } from '@access-control/devices-adapter/hikvision';
import { startOfMinute, subMinutes, endOfMinute } from 'date-fns';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceEvents } from './device-events/device-events.interface';
import { AgentesService } from '@access-control/agentes';
import { ConfigService } from '@nestjs/config';
import { SQLServerConfig, SQLServerExport } from '@access-control/ac-plugin-sqlserver';

@Injectable()
export class DeviceEventsTasks {
    private readonly logger = new Logger(DeviceEventsTasks.name);

    constructor(
        private agentesService: AgentesService,
        private devicesService: DevicesService,
        @InjectModel('DeviceEvents') private readonly deviceEventsModel: Model<DeviceEvents>,
        private configService: ConfigService
    ) {}

    /**
     * [TODO] Esto debería ejecutar un job por reloj
     */

    @Cron('15 * * * * *')
    async handleCron() {
        this.logger.debug('Called when the current second is 45');
        const now = new Date();
        const start = subMinutes(startOfMinute(now), 1700);
        const end = now;

        const devicesMatched = await this.devicesService.getAll({ tags: 'fichada' }, {});
        this.logger.debug(`devices found ${devicesMatched.length}`);

        for (const device of devicesMatched) {
            const deviceClient = new HikVisionDevice(device);

            const eventos: DeviceEventDTO[] = await deviceClient.getEvents(start, end);
            this.logger.debug(`eventos encontrados ${eventos.length}`);
            for (const evt of eventos) {
                const ok = await this.createEvent(device, evt);
                if (ok) {
                    await this.exportSql(device, evt);
                }
            }
        }
    }

    getSQLServer() {
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

        if (entradaTag && salidaTag) {
            this.logger.error(`device ${device.id} tiene entra y salida como tag`);
            return;
        }

        if (!entradaTag && !salidaTag) {
            this.logger.error(`device ${device.id} no esta identificado como entrada o salida`);
            return;
        }

        const agente = await this.agentesService.findById(item.agenteId);
        if (!agente) {
            this.logger.error(`agente ${item.agenteId} no encontrado`);
            return;
        }
        const identificador = agente.identificadores.find((ident) => ident.startsWith('rrhh-legacy'));
        const id = parseInt(identificador.substring(12), 10);

        const sqlExport = this.getSQLServer();
        const personalTable = this.configService.get('SQLSERVER_TABLE');
        const dto = {
            idAgente: id,
            fecha: new Date(item.datetime),
            esEntrada: entradaTag,
            reloj: 32
        };

        await sqlExport.insert(personalTable, dto);
    }

    async createEvent(device: Device, item: DeviceEventDTO) {
        if (!Types.ObjectId.isValid(item.agenteId)) {
            return;
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
}
