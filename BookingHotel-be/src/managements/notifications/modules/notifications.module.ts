import { Module } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { NotificationsController } from '../controllers/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationUser } from '../entities/notification-user.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { ZaloChatModule } from 'src/managements/zalo/zalo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, NotificationUser]), ZaloChatModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule { }
