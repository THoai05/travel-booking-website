import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZaloChat } from './entities/zalo.entity';

@Injectable()
export class ZaloChatService {
    constructor(
        @InjectRepository(ZaloChat)
        private readonly chatRepo: Repository<ZaloChat>,
    ) { }

    async createMessage(data: {
        sender_id: number;
        receiver_id: number;
        message?: string;
        type?: string;
        booking_id?: number;
        notification_id?: number;
        file_url?: string;
        is_from_admin?: boolean;
    }) {
        if (!data.sender_id || !data.receiver_id) {
            throw new BadRequestException('Missing sender or receiver');
        }

        const newMsg = this.chatRepo.create({
            ...data,
            type: (data.type ?? 'text') as ZaloChat['type'],
            status: 'sent',
        });

        return await this.chatRepo.save(newMsg);
    }

    async getChatHistory(userId: number, adminId: number) {
        return await this.chatRepo.createQueryBuilder('chat')
            .where('(chat.sender_id = :userId AND chat.receiver_id = :adminId) OR (chat.sender_id = :adminId AND chat.receiver_id = :userId)', { userId, adminId })
            .orderBy('chat.createdAt', 'ASC')
            .getMany();
    }

    async markAsSeen(id: number) {
        await this.chatRepo.update(id, { status: 'seen' });
    }

    async createImageMessage(file: Express.Multer.File, sender_id: number, receiver_id: number) {
        const filePath = `/uploads/zalo/${file.filename}`; // đường dẫn public
        const message = this.chatRepo.create({
            sender_id,
            receiver_id,
            message: filePath,  // có thể lưu cả message trống
            type: 'image',
            file_url: filePath,     // lưu file path vào DB
        });
        return await this.chatRepo.save(message);
    }
}