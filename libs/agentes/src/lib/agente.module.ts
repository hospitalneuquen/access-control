import { Module } from '@nestjs/common';
import { AgenteController } from './agente.controller';
import { AgentesService } from './agente.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AGENTE_SCHEMA_MONGOOSE } from './agente.schema';

@Module({
    imports: [MongooseModule.forFeature([AGENTE_SCHEMA_MONGOOSE])],
    controllers: [AgenteController],
    providers: [AgentesService]
})
export class AgentesModule {}
