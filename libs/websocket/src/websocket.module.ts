import { Module } from '@nestjs/common';
import { WSGateway } from './websocket.gateway';

@Module({
  providers: [WSGateway]
})
export class WebsocketModule { }
