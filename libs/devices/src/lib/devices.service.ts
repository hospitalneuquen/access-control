import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Device, DeviceRequest } from './device.interface';

@Injectable()
export class DevicesService {
    constructor(@InjectModel('Device') private readonly deviceModel: Model<Device>) {}

    async getAll(): Promise<Device[]> {
        const devices = await this.deviceModel.find().exec();
        return devices;
    }

    async findById(id: string): Promise<Device> {
        if (Types.ObjectId.isValid(id)) {
            const device = await this.deviceModel.findById(id);
            return device;
        }
    }

    async create(device: DeviceRequest): Promise<Device> {
        const newDevice = new this.deviceModel(device);
        return newDevice.save();
    }

    async update(deviceID, device: DeviceRequest): Promise<Device> {
        const updatedDevice = await this.findById(deviceID);
        if (updatedDevice) {
            updatedDevice.set(device);
            await updatedDevice.save();
            return updatedDevice;
        }
    }

    async delete(deviceID): Promise<Device> {
        const deletedDevice = await this.deviceModel.findByIdAndRemove(deviceID);
        return deletedDevice;
    }
}
