import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DevicesService } from './devices.service';
import { DeviceSchema } from './device.schema';
import { DeviceController } from './devices.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Device', schema: DeviceSchema }])],
    controllers: [DeviceController],
    providers: [DevicesService]
})
export class DevicesModule {}
