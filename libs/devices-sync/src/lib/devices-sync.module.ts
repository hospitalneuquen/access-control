import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

import { DeviceSchema, DevicesService } from '@access-control/devices';
import { AgenteSchema, AgentesService } from '@access-control/agentes';
import { DeviceSyncController } from './devices-sync.controller';
import { DevicesSyncConsumer } from './devices-sync.consumer';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Device', schema: DeviceSchema },
            { name: 'Agente', schema: AgenteSchema }
        ]),
        BullModule.registerQueueAsync({
            name: 'devices',
            useFactory: async (config: ConfigService) => ({
                redis: {
                    host: config.get('REDIS_HOST'),
                    port: config.get('REDIS_PORT')
                }
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [DeviceSyncController],
    providers: [AgentesService, DevicesService, DevicesSyncConsumer],
    exports: []
})
export class DevicesSyncModule {}
