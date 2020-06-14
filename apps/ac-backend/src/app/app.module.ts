import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DevicesModule } from '@access-control/devices';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { schemaDefaults } from './util/mongoose-default';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/access-control', {
            useNewUrlParser: true,
            connectionFactory: (connection) => {
                connection.plugin(schemaDefaults);
                return connection;
            }
        }),
        DevicesModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
