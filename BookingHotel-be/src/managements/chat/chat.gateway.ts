import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }

    handleConnection(client: any) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: any) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('join')
    handleJoin(client: any, payload: { user_id: number }) {
        client.join(`user_${payload.user_id}`);
        console.log(`User ${payload.user_id} joined room user_${payload.user_id}`);
    }

    @SubscribeMessage('send')
    async handleMessage(client: any, payload: { senderId: number; receiverId: number; message: string; message_type: 'text' | 'image' | 'file' }) {
        // Lưu vào DB
        const msg = await this.chatService.createMessage(payload.senderId, payload.receiverId, payload.message, payload.message_type);

        // Gửi realtime cho người nhận
        this.server.to(`user_${payload.receiverId}`).emit('newMessage', msg);
        this.server.to(`user_${payload.senderId}`).emit('newMessage', msg);


        // Nếu muốn gửi lại cho sender luôn, uncomment:
        // this.server.to(`user_${payload.senderId}`).emit('newMessage', msg);
    }
}
