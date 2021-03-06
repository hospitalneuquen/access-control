import * as mongoose from 'mongoose';
import { Device } from './device.interface';

export const DeviceSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        host: String,
        port: Number,
        user: String,
        password: String,
        active: Boolean,
        tags: { type: [String], default: [] },
        lastSync: { type: Date, required: false },
        createdAt: { type: Date, required: false },
        updatedAt: { type: Date, required: false }
    },
    { collection: 'devices' }
);

DeviceSchema.pre('save', function (this: Device, next: Function) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

export const DEVICE_MODEL_TOKEN = 'Device';
export const DEVICE_SCHEMA_MONGOOSE = { name: DEVICE_MODEL_TOKEN, schema: DeviceSchema };
