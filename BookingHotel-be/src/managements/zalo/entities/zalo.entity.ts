import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('zalo_chats')
export class ZaloChat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sender_id: number;

    @Column()
    receiver_id: number;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ default: 'text' })
    type: string; // text | image | file

    @Column({ default: 'sent' })
    status: string; // sent | seen

    @Column({ nullable: true })
    booking_id: number;

    @Column({ nullable: true })
    notification_id: number;

    @Column({ nullable: true })
    file_url: string;

    @Column({ default: false })
    is_from_admin: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @ManyToOne(() => Booking, booking => booking.zalo_chats, { nullable: true })
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @ManyToOne(() => Notification, notification => notification.zalo_chats, { nullable: true })
    @JoinColumn({ name: 'notification_id' })
    notification: Notification;

}
