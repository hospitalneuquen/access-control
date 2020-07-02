import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DevicesService } from '@access-control/devices';
import { subMinutes, endOfMinute } from 'date-fns';
import { Queue } from 'bull';
import { DEVICE_SYNC_QUEUE, DEVICE_EVENTS_SYNC_JOB, JobDeviceEventsSyncData } from './devices-sync.consumer';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class DeviceEventsTasks {
    private readonly logger = new Logger(DeviceEventsTasks.name);

    constructor(private devicesService: DevicesService, @InjectQueue(DEVICE_SYNC_QUEUE) private devicesQueue: Queue) {}

    @Cron('15 * * * * *')
    async handleCron() {
        this.logger.debug('Running device events sync task');
        const now = new Date();

        const devicesMatched = await this.devicesService.getAll({ tags: 'fichada' }, {});
        this.logger.debug(`Found ${devicesMatched.length} devices to sync`);

        for (const device of devicesMatched) {
            if (!device.lastSync) {
                const lastSync = endOfMinute(subMinutes(now, 1));
                await this.devicesService.updateLastSync(device, lastSync);
            } else {
                const start = device.lastSync;
                const end = endOfMinute(subMinutes(now, 1));
                const jobData: JobDeviceEventsSyncData = {
                    deviceId: device.id,
                    startTime: start.toISOString(),
                    endTime: end.toISOString()
                };
                await this.devicesQueue.add(DEVICE_EVENTS_SYNC_JOB, jobData);
            }
        }
    }
}
