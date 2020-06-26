import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Agente, AgenteDTO } from './agente.interface';

@Injectable()
export class AgentesService {
    constructor(@InjectModel('Agente') private readonly agenteModel: Model<Agente>) {}

    async getAll(): Promise<Agente[]> {
        const agentes = await this.agenteModel.find().exec();
        return agentes;
    }

    async findById(id: string): Promise<Agente> {
        if (Types.ObjectId.isValid(id)) {
            const agente = await this.agenteModel.findById(id);
            return agente;
        }
    }

    async create(agente: AgenteDTO): Promise<Agente> {
        const newAgente = new this.agenteModel(agente);
        return newAgente.save();
    }

    async update(agenteID, agente: Partial<AgenteDTO>): Promise<Agente> {
        const updatedAgente = await this.findById(agenteID);
        if (updatedAgente) {
            updatedAgente.set(agente);
            await updatedAgente.save();
            return updatedAgente;
        }
    }

    async delete(agenteID): Promise<Agente> {
        const deletedAgente = await this.agenteModel.findByIdAndRemove(agenteID);
        return deletedAgente;
    }
}
