import * as mongoose from 'mongoose';

export const DeviceEventsSchema = new mongoose.Schema(
    {
        deviceId: mongoose.SchemaTypes.ObjectId,
        agenteId: mongoose.SchemaTypes.ObjectId,
        datetime: Date,
        tags: [String],
        createdAt: { type: Date, required: false },
        count: Number
    },
    { collection: 'device_events' }
);
