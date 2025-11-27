// src/push-web/entities/push-subscription.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';

@Entity()
export class PushSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @Column()
    endpoint: string;

    @Column()
    p256dh: string;

    @Column()
    auth: string;
}
