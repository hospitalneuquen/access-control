import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Device, DeviceRequest } from './device.interface';
import { DEVICE_MODEL_TOKEN } from './device.schema';

export interface DeviceSearchParams {
    tags?: string[];
    deviceIds?: string[] | Types.ObjectId[];
}

@Injectable()
export class DevicesService {
    constructor(@InjectModel(DEVICE_MODEL_TOKEN) private readonly deviceModel: Model<Device>) {}

    async search(params: DeviceSearchParams = {}, project: any = null) {
        const { tags, deviceIds } = params;

        const query: any = {
            $and: []
        };
        if (tags && tags.length) {
            tags.forEach((tag) => {
                query.$and.push({ tags: tag });
            });
        }
        if (deviceIds && deviceIds.length) {
            query._id = { $in: deviceIds };
        }
        return this.getAll(query, project);
    }

    async getAll(params = {}, project = null): Promise<Device[]> {
        project = project || { host: 0, port: 0, user: 0, password: 0, createdAt: 0, updatedAt: 0 };
        const devices = await this.deviceModel.find(params, project).exec();
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

    async updateLastSync(device: Device, date: Date = null) {
        if (!date) {
            date = new Date();
        }
        return this.deviceModel.update({ _id: device.id }, { $set: { lastSync: date } });
    }
}
