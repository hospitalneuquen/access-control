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

export const DEVICE_EVENTS_MODEL_TOKEN = 'DeviceEvents';
export const DEVICE_EVENTS_SCHEMA_MONGOOSE = { name: DEVICE_EVENTS_MODEL_TOKEN, schema: DeviceEventsSchema };
