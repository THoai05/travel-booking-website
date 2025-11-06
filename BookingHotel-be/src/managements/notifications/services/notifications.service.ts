import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from 'src/managements/users/entities/users.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepo: Repository<Notification>,

        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) { }

    // Lấy danh sách thông báo theo userId
    async getNotificationsByUserId(userId: number) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.notificationsRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    // Đánh dấu thông báo là đã đọc
    async markAsRead(notificationId: number) {
        const notification = await this.notificationsRepo.findOne({ where: { id: notificationId } });
        if (!notification) throw new NotFoundException('Notification not found');

        notification.isRead = true;
        return this.notificationsRepo.save(notification);
    }

    // Xóa thông báo
    async deleteNotification(notificationId: number) {
        const notification = await this.notificationsRepo.findOne({ where: { id: notificationId } });
        if (!notification) throw new NotFoundException('Notification not found');

        await this.notificationsRepo.remove(notification);
        return { message: 'Notification deleted successfully' };
    }

    // Lấy chi tiết thông báo theo notificationId
    async getNotificationDetail(notificationId: number) {
        const notification = await this.notificationsRepo.findOne({
            where: { id: notificationId },
            relations: ['user'], // nếu muốn lấy thông tin user luôn
        });
        if (!notification) throw new NotFoundException('Notification not found');

        return notification;
    }

    // Tổng số thông báo chưa đọc
    async countUnreadNotifications(userId: number): Promise<number> {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.notificationsRepo.count({
            where: { user: { id: userId }, isRead: false },
        });
    }
}
