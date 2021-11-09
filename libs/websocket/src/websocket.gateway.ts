

import {
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: "*", // A revisar
        methods: ["GET", "POST"]
    }
})
export class WSGateway {
    @WebSocketServer()
    server: Server;
}