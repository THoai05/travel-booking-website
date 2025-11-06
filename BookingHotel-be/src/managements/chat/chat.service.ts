import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/chat.entity';
import { User, UserRole } from '../users/entities/users.entity';

export interface ClientWithUnread {
    id: number;
    username: string;
    unreadCount: number;
}

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message) private readonly msgRepo: Repository<Message>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    // ------------------- Tạo tin nhắn -------------------
    async createMessage(
        senderId: number,
        receiverId: number,
        content: string,
        type: 'text' | 'image' | 'file',
    ) {
        const sender = await this.userRepo.findOneBy({ id: senderId });
        const receiver = await this.userRepo.findOneBy({ id: receiverId });
        if (!sender || !receiver) throw new Error('Sender or receiver not found');

        const msg = this.msgRepo.create({
            sender,
            receiver,
            message: content,
            message_type: type,
            is_read: false,
        });

        return this.msgRepo.save(msg);
    }

    // ------------------- Lấy lịch sử chat giữa 2 người -------------------
    async getChatHistory(userId: number, adminId: number) {
        const messages = await this.msgRepo.find({
            where: [
                { sender: { id: userId }, receiver: { id: adminId } },
                { sender: { id: adminId }, receiver: { id: userId } },
            ],
            order: { created_at: 'ASC' },
            relations: ['sender', 'receiver'],
        });

        return messages.map((msg) => ({
            id: msg.id,
            message: msg.message,
            message_type: msg.message_type,
            is_read: msg.is_read,
            created_at: msg.created_at,
            sender: { id: msg.sender.id, username: msg.sender.username },
            receiver: { id: msg.receiver.id, username: msg.receiver.username },
        }));
    }

    // ------------------- Lấy danh sách client cho admin -------------------
    async getClientsWithUnread(adminId: number): Promise<ClientWithUnread[]> {
        // Lấy tất cả người dùng role = CUSTOMER
        const clients = await this.userRepo.find({ where: { role: UserRole.CUSTOMER } });

        const result: ClientWithUnread[] = [];

        for (const client of clients) {
            const unreadCount = await this.msgRepo.count({
                where: { sender: { id: client.id }, receiver: { id: adminId }, is_read: false },
            });

            result.push({
                id: client.id,
                username: client.username,
                unreadCount,
            });
        }

        return result;
    }

    // ------------------- Đánh dấu tin nhắn đã đọc -------------------
    async markMessagesAsRead(senderId: number, receiverId: number) {
        await this.msgRepo.update(
            { sender: { id: senderId }, receiver: { id: receiverId }, is_read: false },
            { is_read: true },
        );
    }
}
