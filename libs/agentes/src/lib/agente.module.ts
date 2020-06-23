import { Module } from '@nestjs/common';
import { AgenteController } from './agente.controller';
import { AgentesService } from './agente.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AgenteSchema } from './agente.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Agente', schema: AgenteSchema }])],
    controllers: [AgenteController],
    providers: [AgentesService]
})
export class AgentesModule {}
