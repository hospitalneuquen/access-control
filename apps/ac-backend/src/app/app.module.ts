import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DevicesModule } from '@access-control/devices';
import { AgentesModule } from '@access-control/agentes';
import { ImagesModule } from '@access-control/images';
import { DevicesSyncModule } from '@access-control/devices-sync';

import { schemaDefaults } from './util/mongoose-default';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
                useNewUrlParser: true,
                connectionFactory: (connection) => {
                    connection.plugin(schemaDefaults);
                    return connection;
                }
            }),
            inject: [ConfigService],
        }),
        DevicesModule,
        AgentesModule,
        ImagesModule,
        DevicesSyncModule
    ],
    controllers: [],
    providers: []
})
export class AppModule { }
