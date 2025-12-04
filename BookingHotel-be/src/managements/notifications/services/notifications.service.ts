import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';
import { NotificationUser } from '../entities/notification-user.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { PushSubscription } from 'src/managements/push-web/entities/push-subscription.entity';
import { ZaloChatService } from 'src/managements/zalo/zalo.service';
import { PushWebService } from '../../push-web/push-web.service';
import { Not } from 'typeorm';


@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepo: Repository<Notification>,

        @InjectRepository(User)
        private usersRepo: Repository<User>,

        @InjectRepository(PushSubscription)
        private pushWebRepo: Repository<PushSubscription>,

        @InjectRepository(NotificationUser)
        private notificationUserRepo: Repository<NotificationUser>,

        private zaloChatService: ZaloChatService,

        private pushWebService: PushWebService,
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

        try {
            await this.pushWebService.sendToUser(user.id, {
                title: data.title,
                message: data.message,
                url: data.url ?? '/', // optional, nếu muốn click mở trang
            });
        } catch (err) {
            console.error('Web push failed:', err);
        }


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

    // src/notifications/notifications.service.ts
    async createNotificationForAllUsers(data: {
        title: string;
        message: string;
        type?: NotificationType;
        sender_id?: number;
        url?: string;
    }) {
        // 1️⃣ Lấy system user để gán vào notification.userId
        const systemUser = await this.usersRepo.findOne({ where: { id: 1 } });
        if (!systemUser) throw new Error('System user (id=1) not found');

        // 2️⃣ Tạo notification
        const noti = this.notificationsRepo.create({
            title: data.title,
            message: data.message,
            type: data.type ?? NotificationType.PROMOTION,
            user: systemUser, // gán system user
        });
        const savedNoti = await this.notificationsRepo.save(noti);

        // 3️⃣ Lấy tất cả user thực tế (trừ system user)
        const users = await this.usersRepo.find({ where: { id: Not(1) } });

        // 4️⃣ Tạo bản ghi NotificationUser cho từng user
        const notificationUsers = users.map(user =>
            this.notificationUserRepo.create({
                notification: savedNoti,
                user,
                isRead: false,
            }),
        );
        await this.notificationUserRepo.save(notificationUsers);

        // 5️⃣ Gửi Zalo + Web Push
        for (const user of users) {
            try {
                // Gửi Zalo
                await this.zaloChatService.createMessage({
                    sender_id: data.sender_id ?? 1,
                    receiver_id: user.id,
                    type: 'notification',
                    notification_id: savedNoti.id,
                });
            } catch (err) {
                console.error(`Zalo chat failed for user ${user.id}:`, err.message);
            }

            try {
                // Gửi Web Push
                await this.pushWebService.sendToUser(user.id, {
                    title: data.title,
                    message: data.message,
                    url: data.url ?? '/',
                });

            } catch (err) {
                console.error(`Web push failed for user ${user.id}:`, err.message);
            }
        }

        return {
            message: `Đã gửi thông báo đến ${users.length} người dùng`,
            notificationId: savedNoti.id,
        };
    }

    // notifications.service.ts
    async getNotificationsForUser(userId: number) {
        const notificationUsers = await this.notificationUserRepo.find({
            where: { user: { id: userId } },
            relations: ['notification'],
            order: { createdAt: 'DESC' },
        });

        return notificationUsers.map(nu => ({
            id: nu.notification.id,
            title: nu.notification.title,
            message: nu.notification.message,
            type: nu.notification.type,
            createdAt: nu.notification.createdAt,
            isRead: nu.isRead,
        }));
    }

    async findById(id: number) {
        return await this.notificationsRepo.findOne({
            where: { id },
            relations: ['user'], // nếu bạn có quan hệ user
        });
    }
}