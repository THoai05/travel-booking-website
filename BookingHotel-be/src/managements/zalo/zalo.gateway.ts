import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ZaloMessage {
    senderId: string;
    receiverId: string;
    message: string;
    createdAt?: string;
}

@WebSocketGateway({ cors: true })
export class ZaloGateway {
    @WebSocketServer()
    server: Server;

    private messages: ZaloMessage[] = [];

    @SubscribeMessage('zalo_send')
    handleSend(@MessageBody() data: ZaloMessage, @ConnectedSocket() client: Socket) {
        data.createdAt = new Date().toISOString();
        this.messages.push(data);

        this.server.to(data.receiverId).emit('zalo_receive', data);
        return { status: 'ok' };
    }

    @SubscribeMessage('zalo_join')
    handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
        client.join(userId);
        client.emit('zalo_joined', `User ${userId} joined Zalo chat`);
    }

    @SubscribeMessage('zalo_history')
    handleHistory(@MessageBody() userId: string) {
        const history = this.messages.filter(
            m => m.senderId === userId || m.receiverId === userId
        );
        return history;
    }
}
