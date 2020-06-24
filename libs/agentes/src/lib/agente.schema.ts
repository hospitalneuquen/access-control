import * as mongoose from 'mongoose';
import { Agente } from './agente.interface';

export const AgenteSchema = new mongoose.Schema(
    {
        nombre: String,
        fechaNacimiento: Date,
        genero: String,
        documento: String,
        active: Boolean,
        foto: String,

        identificadores: [String],
        devices: [mongoose.SchemaTypes.ObjectId],
        tags: { type: [String], default: [] },

        createdAt: { type: Date, required: false },
        updatedAt: { type: Date, required: false }
    },
    { collection: 'agentes' }
);

AgenteSchema.pre('save', function (this: Agente, next: Function) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});
