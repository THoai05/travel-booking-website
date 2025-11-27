// src/notifications/entities/notification-user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { Notification } from './notification.entity';

@Entity()
export class NotificationUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Notification, notification => notification.notificationUsers, { onDelete: 'CASCADE' })
    notification: Notification;

    @ManyToOne(() => User, user => user.notificationUsers, { onDelete: 'CASCADE' })
    user: User;

    @Column({ default: false })
    isRead: boolean;

    @Column({ type: 'timestamp', nullable: true })
    readAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
