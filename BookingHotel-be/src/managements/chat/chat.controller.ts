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
    @UseGuards(JwtAuthGuard)
    @Get('admin/clients')
    async getClients(@Req() req) {
        if (req.user.role !== 'admin') {
            throw new UnauthorizedException('Chỉ admin mới xem được');
        }
        const adminId = req.user.sub;
        return this.chatService.getClientsWithUnread(adminId);
    }


    // Lấy lịch sử chat với 1 client
    @Get('admin/:clientId')
    @UseGuards(JwtAuthGuard)
    async getChatHistoryWithClient(@Param('clientId') clientId: number, @Req() req) {
        if (req.user.role !== 'admin') {
            throw new UnauthorizedException('Chỉ admin mới xem chat này');
        }
        const adminId = req.user.sub;
        return this.chatService.getChatHistory(clientId, adminId);
    }

    // ------------------- Client / User -------------------

    @Get(':userId/:adminId')
    @UseGuards(JwtAuthGuard)
    async getChatHistory(
        @Param('userId') userId: number,
        @Param('adminId') adminId: number,
        @Req() req
    ) {
        const currentUserId = req.user.sub;

        if (currentUserId !== Number(userId)) {
            throw new UnauthorizedException('Bạn không có quyền xem chat này');
        }

        return this.chatService.getChatHistory(userId, adminId);
    }

    @Post('send')
    @UseGuards(JwtAuthGuard)
    async sendMessage(
        @Body() body: { senderId: number; receiverId: number; message: string; message_type: 'text' | 'image' | 'file' }
    ): Promise<Message> {
        const msg = await this.chatService.createMessage(body.senderId, body.receiverId, body.message, body.message_type);

        // Emit realtime cho cả sender & receiver
        this.chatGateway.server.to(`user_${body.receiverId}`).emit('newMessage', msg);
        this.chatGateway.server.to(`user_${body.senderId}`).emit('newMessage', msg);

        return msg;
    }

    // ------------------- Admin -------------------

    // Lấy danh sách client + số tin nhắn chưa đọc
}
