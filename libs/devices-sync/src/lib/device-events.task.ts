import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DevicesService, Device } from '@access-control/devices';
import { HikVisionDevice } from '@access-control/devices-adapter/hikvision';
import { startOfMinute, subMinutes, endOfMinute } from 'date-fns';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceEvents } from './device-events/device-events.interface';

@Injectable()
export class DeviceEventsTasks {
    private readonly logger = new Logger(DeviceEventsTasks.name);

    constructor(
        private devicesService: DevicesService,
        @InjectModel('DeviceEvents') private readonly deviceEventsModel: Model<DeviceEvents>
    ) {}

    /**
     * [TODO] Esto debería ejecutar un job por reloj
     */

    @Cron('45 * * * * *')
    async handleCron() {
        this.logger.debug('Called when the current second is 45');
        const now = new Date();
        const start = subMinutes(startOfMinute(now), 2);
        const end = now;

        const devicesMatched = await this.devicesService.getAll({ tags: 'fichada' }, {});
        this.logger.debug(`devices found ${devicesMatched.length}`);

        for (const device of devicesMatched) {
            const deviceClient = new HikVisionDevice(device);

            const eventos: DeviceEventDTO[] = await deviceClient.getEvents(start, end);
            this.logger.debug(`eventos encontrados ${eventos.length}`);
            for (const evt of eventos) {
                await this.createEvent(device, evt);
            }
        }
    }

    async createEvent(device: Device, item: DeviceEventDTO) {
        if (!Types.ObjectId.isValid(item.agenteId)) {
            return;
        }
        await this.deviceEventsModel.updateOne(
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
    }
}

interface DeviceEventDTO {
    agenteId: string;
    datetime: string;
    url: string;
}
