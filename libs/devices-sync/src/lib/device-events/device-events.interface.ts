import { Document, Types } from 'mongoose';

export interface DeviceEvents extends Document {
    deviceId: Types.ObjectId;
    agenteId: Types.ObjectId;
    datetime: Date;
    tags: string[];
    createdAt: Date;
    count: number;
}
