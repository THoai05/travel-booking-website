import { Controller, Get, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  // Lấy danh sách thông báo theo userId
  @Get('user/:userId')
  getNotifications(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationsService.getNotificationsByUserId(userId);
  }

  // Đánh dấu thông báo là đã đọc
  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  // Xóa thông báo
  @Delete(':id')
  deleteNotification(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.deleteNotification(id);
  }

  // Lấy chi tiết thông báo theo notificationId
  @Get(':id')
  async getNotificationDetail(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.getNotificationDetail(id);
  }

  // GET /notifications/user/:userId/unread-count
  @Get('user/:userId/unread-count')
  async getUnreadCount(@Param('userId') userId: string) {
    const count = await this.notificationsService.countUnreadNotifications(+userId);
    return { userId: +userId, unreadCount: count };
  }
}
