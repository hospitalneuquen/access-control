import { SQLServerConfig, SQLServerExport } from '@access-control/ac-plugin-sqlserver';
import { AgentesService } from '@access-control/agentes';
import { DevicesService } from '@access-control/devices';
import { HikVisionDevice } from '@access-control/devices-adapter/hikvision';
import { WSGateway } from '@access-control/websocket';
import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { sub } from 'date-fns';
import { DEVICE_AGENT_SYNC_JOB, DEVICE_SYNC_QUEUE, JobDevicesAgentSyncData } from './devices-sync.consumer';

@Controller('devices-sync')
export class DeviceSyncController {
    constructor(
        private configService: ConfigService,
        private agenteService: AgentesService,
        private devicesService: DevicesService,
        @InjectQueue(DEVICE_SYNC_QUEUE) private devicesQueue: Queue,
        private ws: WSGateway
    ) { }

    @Post('sync')
    async syncAgenteOnDevice(@Res() res, @Body() body: DeviceSyncPost) {
        const { agenteId, tags = [], devices = [] } = body;

        const devicesMatched = await this.devicesService.search({ tags, deviceIds: devices });

        await this.agenteService.update(agenteId, { tags, devices: [] });

        const ps = devicesMatched.map(async (device) => {
            const jobData: JobDevicesAgentSyncData = {
                agenteId: agenteId,
                deviceId: device.id
            };
            const job = await this.devicesQueue.add(DEVICE_AGENT_SYNC_JOB, jobData);
        });
        await Promise.all(ps);


        res.json(devicesMatched);
    }

    @Post('re-sync')
    async syncDeviceAgentes(@Res() res) {
        const devices = await this.devicesService.getAll({ active: true }, { host: 1, port: 1, user: 1, password: 1, tags: 1 });

        await this.agenteService.cleanDevices();

        for (const device of devices) {
            const deviceClient = new HikVisionDevice(device);
            const usuarios = await deviceClient.getAll();

            console.log(device.id, usuarios.length)

            for (const user of usuarios) {
                try {
                    await this.agenteService.addDevice(user.employeeNo, device.id);
                } catch (e) {
                    console.log('error', user.employeeNo, device.id)
                }
            }

        }

        return res.json({ ok: 1 })

    }

    @Post('copy')
    async copyDevice(@Res() res, @Body() body: DeviceCopyPost) {
        const { source, target } = body;

        const agentes = await this.agenteService.getAll({ device: source });

        const ps = agentes.map(async (agente) => {
            const jobData: JobDevicesAgentSyncData = {
                agenteId: agente.id,
                deviceId: target
            };
            const job = await this.devicesQueue.add(DEVICE_AGENT_SYNC_JOB, jobData);
        });
        await Promise.all(ps);


        res.json(agentes);
    }



    @Post('/relojes')
    async magia(@Res() res, @Body() body: any) {
        const raw$: any = {};
        if (body.documentos) {
            raw$.documentos = body.documentos;
        }
        const desde = new Date(body.desde);
        const hasta = new Date(body.hasta);

        const devices = await this.devicesService.getAll({ active: true }, { host: 1, port: 1, user: 1, password: 1, tags: 1 });

        const agentes = await this.agenteService.getAll({
            raw: raw$
        });

        const sqlExport = this.getSQLServer();
        let i = 0;
        this.ws.server.emit('logs', `Total Agentes ${agentes.length}`);

        for (const agente of agentes) {
            i++;
            console.log(i, agente.documento)
            this.ws.server.emit('logs', `(${i}) Agente ${agente.documento}`);

            for (const device of devices) {

                const deviceClient = new HikVisionDevice(device);
                if (!device.tags.includes('entrada') && !device.tags.includes('salida')) {
                    continue;
                }

                try {
                    const events = await deviceClient.getEvents(
                        desde,
                        hasta,
                        String(agente.id)
                    );

                    if (device.host === '192.160.150.31') {
                        console.log('hola')
                    }




                    for (const event of events) {

                        const entradaTag = device.tags.includes('entrada');
                        const salidaTag = device.tags.includes('salida');

                        let esEntrada = entradaTag;

                        if (entradaTag && salidaTag) {
                            if (event.attendanceStatus === 'checkIn' || event.attendanceStatus === 'checkOut') {
                                esEntrada = event.attendanceStatus === 'checkIn';
                            } else {
                                // this.logger.error(`device ${device.id} tiene entra y salida como tag`);
                                // return;
                            }
                        }


                        const fecha = sub(new Date(event.datetime), { hours: 3 });
                        const identificador = agente.identificadores.find((ident) => ident.startsWith('rrhh-legacy'));
                        const id = parseInt(identificador.substring(12), 10);

                        const dto2 = {
                            syncTries: 0,
                            idFichada: 0,
                            idAgente: id,
                            fecha,
                            esEntrada: esEntrada,
                            reloj: 32,
                            syncError: null
                        };


                        console.log(dto2.idAgente, dto2.fecha, dto2.esEntrada);

                        const r = await sqlExport.insert('Personal_FichadasSync', dto2);

                    }

                } catch (e) {
                    this.ws.server.emit('logs', `Error con reloj ${device.host}`);
                    console.error(`Error con reloj ${device.host}`);
                    return;

                }

            }
        }

        res.json({ ok: 1 })

    }

    private getSQLServer() {
        const config: SQLServerConfig = {
            server: this.configService.get('SQLSERVER_HOST'),
            port: parseInt(this.configService.get('SQLSERVER_PORT') || '1434', 10),
            user: this.configService.get('SQLSERVER_USER'),
            password: this.configService.get('SQLSERVER_PASSWORD'),
            database: this.configService.get('SQLSERVER_DATABASE'),
            options: { encrypt: false }
        };
        return new SQLServerExport(config);
    }
}

interface DeviceSyncPost {
    agenteId: string;
    tags?: [string];
    devices?: [string];
}

interface DeviceCopyPost {
    source: string;
    target: string;
}