import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZaloChat } from './entities/zalo.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Booking } from '../bookings/entities/bookings.entity';


@Injectable()
export class ZaloChatService {
    constructor(
        @InjectRepository(ZaloChat)
        private readonly chatRepo: Repository<ZaloChat>,
        @InjectRepository(Notification)
        private readonly notificationsRepo: Repository<Notification>,
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
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

    async convertNotificationsToMessages(userId: number, adminId: number) {
        const notis = await this.notificationsRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'ASC' }
        });

        return notis.map(noti => ({
            id: `noti-${noti.id}`,
            sender_id: adminId,
            receiver_id: userId,
            type: 'notification',
            notification_id: noti.id,
            title: noti.title,
            message: noti.message,
            createdAt: noti.createdAt
        }));
    }



    async convertBookingsToMessages(userId: number, adminId: number) {
        const bookings = await this.bookingRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'ASC' }
        });

        return bookings.map(b => ({
            id: `booking-${b.id}`,
            sender_id: adminId,
            receiver_id: userId,
            type: 'booking',
            booking_id: b.id,
            check_in_date: b.checkInDate,
            check_out_date: b.checkOutDate,
            guest_count: b.guestsCount,
            contact_full_name: b.contactFullName,
            contact_email: b.contactEmail,
            contact_phone: b.contactPhone,
            total_price: b.totalPrice,
            special_requests: b.specialRequests,
            status: b.status,
            createdAt: b.createdAt
        }));
    }



    async getChatHistory(userId: number, adminId: number) {
        const chatMessages = await this.chatRepo.find({
            where: [
                { sender_id: userId, receiver_id: adminId },
                { sender_id: adminId, receiver_id: userId },
            ],
            order: { createdAt: 'ASC' }
        });

        const notificationMessages = await this.convertNotificationsToMessages(userId, adminId);
        const bookingMessages = await this.convertBookingsToMessages(userId, adminId);

        const all = [
            ...chatMessages,
            ...notificationMessages,
            ...bookingMessages,
        ];

        // Sắp xếp theo thời gian
        all.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return all;
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