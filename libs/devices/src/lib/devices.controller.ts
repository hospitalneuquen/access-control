import { HikVisionDevice, HikVisionOptions } from '@access-control/devices-adapter/hikvision';
import {
    Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param,
    Patch, Post, Query, Res
} from '@nestjs/common';
import { DeviceRequest } from './device.interface';
import { DevicesService } from './devices.service';

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

    @Get('/:id/list')
    async getListPeople(@Res() res, @Param('id') deviceID: string) {
        const device = await this.devicesService.findById(deviceID);
        if (!device) {
            throw new NotFoundException('device not found');
        }
        const deviceClient = new HikVisionDevice(device);
        const users = await deviceClient.listUser({ limit: 50, skip: 0 });
        return res.status(HttpStatus.OK).json(users);
    }


    @Delete('/:id/delete')
    async deletePeople(@Res() res, @Param('id') deviceID: string) {
        const device = await this.devicesService.findById(deviceID);
        if (!device) {
            throw new NotFoundException('device not found');
        }
        const deviceClient = new HikVisionDevice(device);
        const users = await deviceClient.listUser({ limit: 50, skip: 0 });

        for (const user of users) {

            await deviceClient.deleteUser(user.employeeNo);

        }


        return res.status(HttpStatus.OK).json(users);
    }

    @Get('/:id/events')
    async getEvents(@Res() res, @Param('id') deviceID: string, @Query() query) {
        const device = await this.devicesService.findById(deviceID);
        if (!device) {
            throw new NotFoundException('device not found');
        }
        const deviceClient = new HikVisionDevice(device);
        const users = await deviceClient.getEvents(new Date(query.start), new Date(query.end), query.agente);
        return res.status(HttpStatus.OK).json(users);
    }

    @Get('/:id/people/:emploee/photo')
    async getPeoplePhoto(@Res() res, @Param('id') deviceID: string, @Param('emploee') emploee: string) {
        const device = await this.devicesService.findById(deviceID);
        if (!device) {
            throw new NotFoundException('device not found');
        }
        const deviceClient = new HikVisionDevice(device);
        const users = await deviceClient.getPhoto(emploee);
        res.header('content-type', 'images/jpeg');
        users.body.pipe(res);
        // return res.status(HttpStatus.OK).json(users);
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
        const device = await this.devicesService.delete(deviceID);
        if (!device) {
            throw new NotFoundException('device not found');
        }
        return res.status(HttpStatus.OK).json(device);
    }


}
