import { Controller, UseGuards, Req, Get, Param, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
    @UseGuards(JwtAuthGuard)
    async getChatHistory(
        @Param('userId') userId: number,
        @Param('adminId') adminId: number,
        @Req() req
    ) {
        // 🔹 Dùng req.user.sub thay vì req.user.id
        const currentUserId = req.user.sub;

        if (currentUserId !== Number(userId)) {
            throw new UnauthorizedException('Bạn không có quyền xem chat này');
        }

        return this.chatService.getChatHistory(userId, adminId);
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
