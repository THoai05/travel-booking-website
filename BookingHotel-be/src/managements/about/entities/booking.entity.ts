// src/booking/entities/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../entities/room.entity'; // Cần Entity Room để JOIN

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id: number; // 1. id: int(11) PRIMARY KEY AUTO_INCREMENT

    @Column()
    status: string; // 2. status: varchar(255) - KHÔNG NULL

    @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number; // 3. total_price: decimal(10,2) - KHÔNG NULL

    @Column({ name: 'created_at' })
    createdAt: Date; // 4. created_at: datetime(6)

    @Column({ name: 'user_id', nullable: true })
    userId: number; // 5. user_id: int(11) - CÓ NULL

    @Column({ name: 'room_id', nullable: true })
    roomId: number; // 6. room_id: int(11) - CÓ NULL

    // --- Khai báo Quan hệ (Relationship) ---
    // ManyToOne: Kết nối Booking -> Room
    @ManyToOne(() => Room, (room) => room.bookings)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    // Pro cần thêm quan hệ với User Entity tại đây nếu cần JOIN user.
    // @ManyToOne(() => User, (user) => user.bookings)
    // @JoinColumn({ name: 'user_id' })
    // user: User;
}