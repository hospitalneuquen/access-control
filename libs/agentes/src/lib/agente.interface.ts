import { Document } from 'mongoose';

export interface AgenteDTO extends Document {
    fechaNacimiento: Date;
    genero: String;
    documento: String;
    active: Boolean;
}

export interface Agente extends Document, AgenteDTO {
    createdAt: Date;
    updatedAt?: Date;
}
