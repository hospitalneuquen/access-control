import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DevicesService } from './devices.service';
import { DeviceSchema } from './device.schema';
import { DeviceController } from './devices.controller';

import { AgenteSchema, AgentesService } from '@access-control/agentes';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Device', schema: DeviceSchema },
            { name: 'Agente', schema: AgenteSchema }
        ])
    ],
    controllers: [DeviceController],
    providers: [DevicesService, AgentesService]
})
export class DevicesModule { }
