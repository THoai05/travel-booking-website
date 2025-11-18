import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { ZaloChatService } from 'src/managements/zalo/zalo.service';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepo: Repository<Notification>,

        @InjectRepository(User)
        private usersRepo: Repository<User>,

        private zaloChatService: ZaloChatService,
    ) { }

    // ==========================
    // Tạo thông báo + đẩy tin nhắn vào zalo_chat
    // ==========================
    async createNotification(data: any) {
        const user = await this.usersRepo.findOne({ where: { id: data.user_id } });
        if (!user) throw new NotFoundException('User not found');

        const noti = this.notificationsRepo.create({
            title: data.title,
            message: data.message,
            type: data.type ?? 'system',
            user: user, // phải gán entity user, không gán user_id
        });

        const savedNoti = await this.notificationsRepo.save(noti);

        // 2️⃣ Gửi thông báo vào zalo chat
        await this.zaloChatService.createMessage({
            sender_id: data.sender_id ?? 1,  // admin
            receiver_id: data.user_id,
            type: 'notification',
            notification_id: savedNoti.id,
        });

        return savedNoti;
    }

    // ==========================
    // Các hàm cũ giữ nguyên
    // ==========================
    async getNotificationsByUserId(userId: number) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.notificationsRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(notificationId: number) {
        const notification = await this.notificationsRepo.findOne({ where: { id: notificationId } });
        if (!notification) throw new NotFoundException('Notification not found');

        notification.isRead = true;
        return this.notificationsRepo.save(notification);
    }

    async deleteNotification(notificationId: number) {
        const notification = await this.notificationsRepo.findOne({ where: { id: notificationId } });
        if (!notification) throw new NotFoundException('Notification not found');

        await this.notificationsRepo.delete(notificationId); // CASCADE sẽ xóa zalo_chats
        return { message: 'Notification deleted successfully' };
    }




    async getNotificationDetail(notificationId: number) {
        const notification = await this.notificationsRepo.findOne({
            where: { id: notificationId },
            relations: ['user'],
        });

        if (!notification) throw new NotFoundException('Notification not found');
        return notification;
    }

    async countUnreadNotifications(userId: number): Promise<number> {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.notificationsRepo.count({
            where: { user: { id: userId }, isRead: false },
        });
    }

    // ==========================
    // Lấy toàn bộ notifications (admin)
    // ==========================
    async getAllNotificationsWithPagination(skip: number, take: number) {
        const [data, total] = await this.notificationsRepo.findAndCount({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip,
            take,
        });
        return [data, total];
    }

    // ==========================
    // Update notification
    // ==========================
    async updateNotification(id: number, updateData: any) {
        const noti = await this.notificationsRepo.findOne({ where: { id } });
        if (!noti) throw new NotFoundException('Notification not found');

        // Cập nhật trường cho phép
        noti.title = updateData.title ?? noti.title;
        noti.message = updateData.message ?? noti.message;
        noti.type = updateData.type ?? noti.type;

        // Nếu muốn update luôn is_read:
        if (updateData.isRead !== undefined) {
            noti.isRead = updateData.isRead;
        }

        return this.notificationsRepo.save(noti);
    }

    async markAllAsRead(userId: number) {
        try {
            const result = await this.notificationsRepo
                .createQueryBuilder()
                .update(Notification)
                .set({ isRead: true })
                .where('user_id = :userId AND is_read = false', { userId })
                .execute();

            return { message: `${result.affected} notifications marked as read` };
        } catch (error) {
            console.error('markAllAsRead error:', error);
            throw error;
        }
    }



}