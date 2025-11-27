import { Module } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { NotificationsController } from '../controllers/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationUser } from '../entities/notification-user.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { ZaloChatModule } from 'src/managements/zalo/zalo.module';
import { PushWebModule } from 'src/managements/push-web/push-web.module';
import { PushSubscription } from 'src/managements/push-web/entities/push-subscription.entity';
import { PushWebService } from 'src/managements/push-web/push-web.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, NotificationUser, PushSubscription]), ZaloChatModule, PushWebModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, PushWebService],
  exports: [NotificationsService],
})
export class NotificationsModule { }
