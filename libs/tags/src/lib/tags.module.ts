import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DEVICE_SCHEMA_MONGOOSE } from '@access-control/devices';
import { TagsController } from './tags.controller';

@Module({
    imports: [
        MongooseModule.forFeature([DEVICE_SCHEMA_MONGOOSE]),
    ],
    controllers: [
        TagsController
    ],
    providers: [],
    exports: []
})
export class TagsModule { }
