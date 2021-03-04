import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Agente, AgenteDTO, AgentesQuerySearch } from './agente.interface';
import { AGENTE_MODEL_TOKEN } from './agente.schema';

@Injectable()
export class AgentesService {
    constructor(@InjectModel(AGENTE_MODEL_TOKEN) private readonly agenteModel: Model<Agente>) { }

    async getAll(query: AgentesQuerySearch = {}): Promise<Agente[]> {
        const q: any = {};

        if (query.documento) {
            q.documento = query.documento;
        }

        if (query.nombre) {
            q.nombre = new RegExp('.*' + query.nombre + '.*', 'i');
        }

        if (query.device) {
            q.devices = new Types.ObjectId(query.device);
        }

        const command = this.agenteModel.find(q);

        if (query.limit) {
            command.limit(query.limit);
        }

        if (query.skip) {
            command.skip(query.skip);
        }


        const agentes = await this.agenteModel.find(q);
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
