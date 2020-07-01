import { Controller, Post, Res, Body } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DevicesService } from '@access-control/devices';
import { JobDevicesSyncData } from './devices-sync.consumer';
import { DEVICE_EVENTS_MODEL_TOKEN } from './device-events/device-events.schema';

@Controller('devices-sync')
export class DeviceSyncController {
    constructor(private devicesService: DevicesService, @InjectQueue(DEVICE_EVENTS_MODEL_TOKEN) private devicesQueue: Queue) { }

    @Post('sync')
    async syncAgenteOnDevice(@Res() res, @Body() body: DeviceSyncPost) {
        const { agenteId, tags = [], devices = [] } = body;
        const query: any = {
            $and: []
        };
        if (tags.length) {
            tags.forEach((tag) => {
                query.$and.push({ tags: tag });
            });
        }
        if (devices.length) {
            query._id = { $in: devices };
        }

        const devicesMatched = await this.devicesService.getAll(query);

        const ps = devicesMatched.map(async (device) => {
            const jobData: JobDevicesSyncData = {
                agenteId: agenteId,
                deviceId: device.id
            };
            const job = await this.devicesQueue.add(jobData);
        });
        await Promise.all(ps);
        res.json(devicesMatched);
    }
}

interface DeviceSyncPost {
    agenteId: string;
    tags?: [string];
    devices?: [string];
}
