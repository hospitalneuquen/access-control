import { Document } from 'mongoose';

export interface Device extends Document {
    name: string;
    description: string;
    host: string;
    port: number;
    user: string;
    password: string;
    active: boolean;
    tags: string[];
    lastSync?: Date;
    createdAt: Date;
    updatedAt?: Date;
}

export interface DeviceRequest {
    name: string;
    description: string;
    host: string;
    active: boolean;
    port: number;
    user: string;
    password: string;
    tags: string[];
}

export interface DeviceResponse {
    id: string;
    name: string;
    description: string;
    host: string;
    active: boolean;
    port: number;
    user: string;
    password: string;
    tags: string[];
    lastSync?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
