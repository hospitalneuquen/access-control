import { Document, Types } from 'mongoose';


export interface AgentesQuerySearch {
    skip?: number;
    limit?: number;
    documento?: string;
    nombre?: string;
}

export interface AgenteDTO {
    id?: string;
    nombre: string;
    fechaNacimiento: Date;
    genero: string;
    documento: string;
    active: boolean;
    foto: string;
    devices: Types.ObjectId[];
    identificadores: String[];
}

export interface Agente extends Document {
    nombre: string;
    fechaNacimiento: Date;
    genero: string;
    documento: string;
    active: Boolean;
    foto: string;
    devices: Types.ObjectId[];
    identificadores: String[];
    createdAt: Date;
    updatedAt?: Date;
}
