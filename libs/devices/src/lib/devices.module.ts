import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DevicesService } from './devices.service';
import { DEVICE_SCHEMA_MONGOOSE } from './device.schema';
import { DeviceController } from './devices.controller';

@Module({
    imports: [MongooseModule.forFeature([DEVICE_SCHEMA_MONGOOSE])],
    controllers: [DeviceController],
    providers: [DevicesService]
})
export class DevicesModule {}
