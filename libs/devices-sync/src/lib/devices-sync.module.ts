import { AgentesService, AGENTE_SCHEMA_MONGOOSE } from '@access-control/agentes';
import { DevicesService, DEVICE_SCHEMA_MONGOOSE } from '@access-control/devices';
import { WebsocketModule, WSGateway } from '@access-control/websocket';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { DeviceEventsTasks } from './device-events.task';
import { DEVICE_EVENTS_SCHEMA_MONGOOSE } from './device-events/device-events.schema';
import { DevicesSyncConsumer, DEVICE_SYNC_QUEUE } from './devices-sync.consumer';
import { DeviceSyncController } from './devices-sync.controller';


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
        ScheduleModule.forRoot(),
        WebsocketModule
    ],
    controllers: [DeviceSyncController],
    providers: [AgentesService, DevicesService, DevicesSyncConsumer, DeviceEventsTasks, WSGateway],
    exports: []
})
export class DevicesSyncModule { }
