import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { Booking } from '../../bookings/entities/bookings.entity';
import { Notification } from '../../notifications/entities/notification.entity';

export enum ZaloChatType {
    TEXT = 'text',
    IMAGE = 'image',
    FILE = 'file',
    NOTIFICATION = 'notification',
}

export enum ZaloChatStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read',
}

@Entity('zalo_chats')
export class ZaloChat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;

    @Column('text')
    message: string;

    @Column({ type: 'enum', enum: ZaloChatType, default: ZaloChatType.TEXT })
    type: ZaloChatType;

    @Column({ type: 'enum', enum: ZaloChatStatus, default: ZaloChatStatus.SENT })
    status: ZaloChatStatus;

    @ManyToOne(() => Booking, booking => booking.id, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'booking_id' })
    relatedBooking?: Booking;

    @ManyToOne(() => Notification, Notification => Notification.id, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'notification_id' })
    relatedNotification?: Booking;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
