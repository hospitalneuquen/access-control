import { Document } from 'mongoose';

export interface AgenteDTO extends Document {
    nombre: string,
    fechaNacimiento: Date;
    genero: string;
    documento: string;
    active: boolean;
    foto: string;
}

export interface Agente extends Document {
    nombre: string,
    fechaNacimiento: Date;
    genero: string;
    documento: string;
    active: Boolean;
    foto: string;
    createdAt: Date;
    updatedAt?: Date;
}
