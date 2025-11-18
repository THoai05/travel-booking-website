import { Controller, Post, Get, Query, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  // ==========================
  // CLIENT ROUTES
  // ==========================

  @Get('user/:userId')
  getNotifications(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationsService.getNotificationsByUserId(userId);
  }
  // POST /notifications
  @Post()
  create(@Body() data: any) {
    return this.notificationsService.createNotification(data);
  }


  @Get('user/:userId/unread-count')
  getUnreadCount(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationsService.countUnreadNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  deleteNotification(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.deleteNotification(id);
  }

  // ==========================
  // ADMIN ROUTES
  // ==========================

  @Get()
  async getAllNotifications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.notificationsService.getAllNotificationsWithPagination(skip, limit);
    return { data, total };
  }

  @Patch(':id')
  updateNotification(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.notificationsService.updateNotification(id, body);
  }

  // Để tránh conflict đặt /detail/:id
  @Get('detail/:id')
  getNotificationDetail(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.getNotificationDetail(id);
  }

  @Patch('mark-notifications-read/:userId')
  async markNotificationsRead(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationsService.markAllAsRead(userId);
  }

}
