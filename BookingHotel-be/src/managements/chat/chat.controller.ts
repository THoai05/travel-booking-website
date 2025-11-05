import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/chat.entity';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly chatGateway: ChatGateway,
    ) { }

    @Get(':userId/:adminId')
    async getChatHistory(
        @Param('userId') userId: string,
        @Param('adminId') adminId: string,
    ) {
        return this.chatService.getChatHistory(+userId, +adminId);
    }


    @Post('send')
    async sendMessage(
        @Body() body: { senderId: number; receiverId: number; message: string; message_type: 'text' | 'image' | 'file' }
    ): Promise<Message> {
        const msg = await this.chatService.createMessage(body.senderId, body.receiverId, body.message, body.message_type);

        // ✅ Emit realtime sau khi lưu DB
        this.chatGateway.server.to(`user_${body.receiverId}`).emit('newMessage', msg);
        this.chatGateway.server.to(`user_${body.senderId}`).emit('newMessage', msg);

        return msg;
    }
}
