import { DevicesService } from '@access-control/devices';
import { HikVisionDevice } from '@access-control/devices-adapter/hikvision';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { endOfMinute, subMinutes } from 'date-fns';
import { DEVICE_EVENTS_SYNC_JOB, DEVICE_SYNC_QUEUE, JobDeviceEventsSyncData } from './devices-sync.consumer';

@Injectable()
export class DeviceEventsTasks {
    private readonly logger = new Logger(DeviceEventsTasks.name);

    constructor(private devicesService: DevicesService, @InjectQueue(DEVICE_SYNC_QUEUE) private devicesQueue: Queue) { }

    @Cron('15 * * * *')
    async handleCron() {
        this.logger.debug('Running device events sync task');
        const now = new Date();

        const devicesMatched = await this.devicesService.getAll({ tags: 'fichada' }, {});
        this.logger.debug(`Found ${devicesMatched.length} devices to sync`);

        for (const device of devicesMatched) {
            if (!device.lastSync) {
                const lastSync = endOfMinute(subMinutes(now, 5));
                await this.devicesService.updateLastSync(device, lastSync);
            } else {
                const start = endOfMinute(subMinutes(device.lastSync, 5));;
                const end = endOfMinute(subMinutes(now, 5));
                const jobData: JobDeviceEventsSyncData = {
                    deviceId: device.id,
                    startTime: start.toISOString(),
                    endTime: end.toISOString()
                };
                await this.devicesQueue.add(DEVICE_EVENTS_SYNC_JOB, jobData);
            }
        }
    }


    @Cron('0 3 * * *')
    async rebootDevices() {
        this.logger.debug('Running device events sync task');
        const now = new Date();

        const devicesMatched = await this.devicesService.getAll({ active: true }, {});
        this.logger.debug(`Found ${devicesMatched.length} devices to sync`);

        for (const device of devicesMatched) {
            const deviceClient = new HikVisionDevice(device);
            await deviceClient.reboot();
        }
    }
}
