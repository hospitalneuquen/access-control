import * as mongoose from 'mongoose';

export const DeviceSchema = new mongoose.Schema({
    name: String,
    description: String,
    host: String,
    active: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})