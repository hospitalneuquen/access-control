import { Document } from 'mongoose';

export interface Device extends Document {
    readonly name: string;
    readonly description: string;
    readonly host: string;
    readonly active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}