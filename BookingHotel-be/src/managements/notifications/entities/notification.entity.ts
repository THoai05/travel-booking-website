import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { ZaloChat } from 'src/managements/zalo/entities/zalo.entity';
import { NotificationUser } from './notification-user.entity';

export enum NotificationType {
  BOOKING = 'booking',
  PAYMENT = 'payment',
  PROMOTION = 'promotion',
  SYSTEM = 'system',  // thêm dòng này
}


@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @OneToMany(() => ZaloChat, chat => chat.notification)
  zalo_chats: ZaloChat[];

  @OneToMany(() => NotificationUser, nu => nu.notification)
  notificationUsers: NotificationUser[];
}
