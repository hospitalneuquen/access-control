import { Document, Types } from 'mongoose';

export interface AgenteDTO {
    nombre: string;
    fechaNacimiento: Date;
    genero: string;
    documento: string;
    active: boolean;
    foto: string;
    devices: [Types.ObjectId];
}

export interface Agente extends Document {
    nombre: string;
    fechaNacimiento: Date;
    genero: string;
    documento: string;
    active: Boolean;
    foto: string;
    devices: [Types.ObjectId];
    createdAt: Date;
    updatedAt?: Date;
}
