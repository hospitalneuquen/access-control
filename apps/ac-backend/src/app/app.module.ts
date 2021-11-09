import { AgentesModule } from '@access-control/agentes';
import { DevicesModule } from '@access-control/devices';
import { DevicesSyncModule } from '@access-control/devices-sync';
import { ImagesModule } from '@access-control/images';
import { TagsModule } from '@access-control/tags';
import { WebsocketModule } from '@access-control/websocket';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
            inject: [ConfigService]
        }),
        DevicesModule,
        AgentesModule,
        ImagesModule,
        DevicesSyncModule,
        TagsModule,
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'dist/apps/ac-frontend'),
        }),
        WebsocketModule
    ],
    controllers: [],
    providers: []
})
export class AppModule { }
