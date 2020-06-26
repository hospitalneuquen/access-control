import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { DevicesModule } from '@access-control/devices';
import { AgentesModule } from '@access-control/agentes';
import { ImagesModule } from '@access-control/images';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { schemaDefaults } from './util/mongoose-default';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot('mongodb://localhost/access-control', {
            useNewUrlParser: true,
            connectionFactory: (connection) => {
                connection.plugin(schemaDefaults);
                return connection;
            }
        }),
        DevicesModule,
        AgentesModule,
        ImagesModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }
