import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DevicesService, DEVICE_SCHEMA_MONGOOSE } from '@access-control/devices';
import { AgentesService, AGENTE_SCHEMA_MONGOOSE } from '@access-control/agentes';
import { DEVICE_EVENTS_SCHEMA_MONGOOSE } from './device-events/device-events.schema';
import { DeviceSyncController } from './devices-sync.controller';
import { DevicesSyncConsumer, DEVICE_SYNC_QUEUE } from './devices-sync.consumer';
import { DeviceEventsTasks } from './device-events.task';

@Module({
    imports: [
        MongooseModule.forFeature([DEVICE_SCHEMA_MONGOOSE, AGENTE_SCHEMA_MONGOOSE, DEVICE_EVENTS_SCHEMA_MONGOOSE]),
        BullModule.registerQueueAsync({
            name: DEVICE_SYNC_QUEUE,
            useFactory: async (config: ConfigService) => ({
                redis: {
                    host: config.get('REDIS_HOST'),
                    port: config.get('REDIS_PORT')
                }
            }),
            inject: [ConfigService]
        }),
        ScheduleModule.forRoot()
    ],
    controllers: [DeviceSyncController],
    providers: [AgentesService, DevicesService, DevicesSyncConsumer, DeviceEventsTasks],
    exports: []
})
export class DevicesSyncModule {}
