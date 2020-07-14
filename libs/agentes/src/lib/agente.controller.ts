import { AgentesService } from './agente.service';
import { Controller, Get, Res, HttpStatus, Post, Body, NotFoundException, Delete, Param, Patch, Query } from '@nestjs/common';
import { AgenteDTO, AgentesQuerySearch } from './agente.interface';

@Controller('agentes')
export class AgenteController {
    constructor(private agentesService: AgentesService) { }

    @Get('/')
    async getAllAgentes(@Res() res, @Query() query: AgentesQuerySearch) {
        const agentes = await this.agentesService.getAll(query);
        return res.status(HttpStatus.OK).json(agentes);
    }

    @Get('/:id')
    async getDevice(@Res() res, @Param('id') id: string) {
        const agente = await this.agentesService.findById(id);
        if (!agente) {
            throw new NotFoundException('agente not found');
        }
        return res.status(HttpStatus.OK).json(agente);
    }

    @Post()
    async create(@Res() res, @Body() body: AgenteDTO) {
        const agente = await this.agentesService.create(body);
        return res.status(HttpStatus.OK).json(agente);
    }

    @Patch('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() body: AgenteDTO) {
        const agente = await this.agentesService.update(id, body);
        if (!agente) {
            throw new NotFoundException('agente not found');
        }
        return res.status(HttpStatus.OK).json(agente);
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const agente = await this.agentesService.delete(id);
        if (!agente) {
            throw new NotFoundException('agente not found');
        }
        return res.status(HttpStatus.OK).json(agente);
    }
}
