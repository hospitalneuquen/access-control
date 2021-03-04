import { Controller, Post, Res, Body } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DevicesService } from '@access-control/devices';
import { JobDevicesAgentSyncData, DEVICE_SYNC_QUEUE, DEVICE_AGENT_SYNC_JOB } from './devices-sync.consumer';
import { AgentesService } from '@access-control/agentes';

@Controller('devices-sync')
export class DeviceSyncController {
    constructor(private agenteService: AgentesService, private devicesService: DevicesService, @InjectQueue(DEVICE_SYNC_QUEUE) private devicesQueue: Queue) { }

    @Post('sync')
    async syncAgenteOnDevice(@Res() res, @Body() body: DeviceSyncPost) {
        const { agenteId, tags = [], devices = [] } = body;

        const devicesMatched = await this.devicesService.search({ tags, deviceIds: devices });

        const ps = devicesMatched.map(async (device) => {
            const jobData: JobDevicesAgentSyncData = {
                agenteId: agenteId,
                deviceId: device.id
            };
            const job = await this.devicesQueue.add(DEVICE_AGENT_SYNC_JOB, jobData);
        });
        await Promise.all(ps);

        await this.agenteService.update(agenteId, { tags })

        res.json(devicesMatched);
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