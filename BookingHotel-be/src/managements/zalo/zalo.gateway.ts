import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ZaloChatService } from './zalo.service';

@WebSocketGateway({
    cors: { origin: '*' },
})
export class ZaloChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, number> = new Map(); // Map<socketId, userId>

    constructor(private readonly chatService: ZaloChatService) { }

    // Khi client kết nối
    handleConnection(client: Socket) {
        console.log(`✅ Client connected: ${client.id}`);
    }

    // Khi client ngắt kết nối
    handleDisconnect(client: Socket) {
        console.log(`❌ Client disconnected: ${client.id}`);
        this.connectedUsers.delete(client.id);
    }

    // Người dùng join room (VD: zalo_1)
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { userId: number }) {
        if (!payload?.userId) return;

        const room = `zalo_${payload.userId}`;
        client.join(room);
        this.connectedUsers.set(client.id, payload.userId);
        console.log(`📩 ${client.id} joined room: ${room}`);
    }

    // Khi client gửi message realtime
    @SubscribeMessage('sendMessage')
    async handleSendMessage(@MessageBody() payload: any) {
        // 1️⃣ Lưu tin nhắn vào DB
        const msg = await this.chatService.createMessage(payload);

        // 2️⃣ Gửi lại realtime cho cả 2 phòng (người gửi + người nhận)
        this.emitMessage(msg);
        return msg;
    }

    // Hàm dùng để broadcast tin nhắn
    async emitMessage(msg: any) {
        const senderRoom = `zalo_${msg.sender_id}`;
        const receiverRoom = `zalo_${msg.receiver_id}`;

        console.log(`📤 Emit message to: ${senderRoom} and ${receiverRoom}`);
        this.server.to(senderRoom).emit('newMessage', msg);
        this.server.to(receiverRoom).emit('newMessage', msg);
    }

    // Hàm emit notification
    async emitNotification(noti: any) {
        const receiverRoom = `zalo_${noti.receiver_id}`;
        console.log(`📤 Emit notification to room: ${receiverRoom}`);
        this.server.to(receiverRoom).emit('newNotification', noti);
    }

}
