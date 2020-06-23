import { DevicesService } from './devices.service';
import { Controller, Get, Res, HttpStatus, Post, Body, NotFoundException, Delete, Param, Patch } from '@nestjs/common';
import { DeviceRequest } from './device.interface';
import { HikVisionDevice, HikVisionOptions } from '@access-control/devices-adapter/hikvision';

@Controller('devices')
export class DeviceController {
    constructor(private devicesService: DevicesService) { }

    @Post('/test')
    async test(@Res() res, @Body() body: HikVisionOptions) {
        try {
            const deviceClient = new HikVisionDevice(body);
            const total = await deviceClient.count();
            return res.status(HttpStatus.OK).json({ total: total });
        } catch (e) {
            return res.status(400).json({
                statusCode: 400,
                message: 'host not found or wrong password'
            });
        }
    }

    @Get('/')
    async getAllDevices(@Res() res) {
        const customers = await this.devicesService.getAll();
        return res.status(HttpStatus.OK).json(customers);
    }

    @Get('/:id')
    async getDevice(@Res() res, @Param('id') deviceID: string) {
        const device = await this.devicesService.findById(deviceID);
        if (!device) {
            throw new NotFoundException('device not found');
        }
        return res.status(HttpStatus.OK).json(device);
    }

    @Post()
    async create(@Res() res, @Body() body: DeviceRequest) {
        const device = await this.devicesService.create(body);
        return res.status(HttpStatus.OK).json(device);
    }

    @Patch('/:id')
    async update(@Res() res, @Param('id') deviceID: string, @Body() body: DeviceRequest) {
        const device = await this.devicesService.update(deviceID, body);
        if (!device) {
            throw new NotFoundException('device not found');
        }
        return res.status(HttpStatus.OK).json(device);
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') deviceID: string) {
        const device = await this.devicesService.delete(
            deviceID
        );
        if (!device) {
            throw new NotFoundException('device not found');
        }
        return res.status(HttpStatus.OK).json(device);
    }
}
