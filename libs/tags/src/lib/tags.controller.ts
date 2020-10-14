import { Device, DEVICE_MODEL_TOKEN } from '@access-control/devices';
import {
    Controller,
    Get,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('tags')
export class TagsController {
    constructor(@InjectModel(DEVICE_MODEL_TOKEN) private readonly deviceModel: Model<Device>) { }

    @Get('/')
    async getAllDevices(@Res() res) {
        const tags = await this.deviceModel.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags' } }
        ]);
        return res.json(tags.map(item => item._id));
    }

}
