// src/push-web/entities/push-subscription.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';

@Entity('push_subscriptions')
export class PushSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.pushSubscriptions, { onDelete: 'CASCADE' })
    user: User;

    @Column('text')
    endpoint: string;

    @Column('text')
    p256dh: string;

    @Column('text')
    auth: string;

    @CreateDateColumn()
    createdAt: Date;
}
