import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { DevicesService } from '@access-control/devices';
import { AgentesService } from '@access-control/agentes';
import { ConfigService } from '@nestjs/config';
import { HikVisionDevice } from '@access-control/devices-adapter/hikvision';

export interface JobDevicesSyncData {
    deviceId: string;
    agenteId: string;
}

@Processor('devices')
export class DevicesSyncConsumer {
    private HOST = '';

    constructor(
        private devicesService: DevicesService,
        private agenteService: AgentesService,
        private configService: ConfigService
    ) {
        this.HOST = this.configService.get('APP_HOST');
    }

    @Process()
    async sync(job: Job<JobDevicesSyncData>) {
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

        const r = await deviceClient.addUser({
            id: agente.id,
            name: agente.nombre
        });

        // const r3 = await deviceClient.deletePhoto(agente.id);

        const r2 = await deviceClient.addPhoto({
            id: agente.id,
            name: agente.nombre,
            url: `${this.HOST}/api/images/${agente.foto}.jpeg`
        });

        agente.devices.push(device.id);

        await agente.save();

        return true;
    }
}
