// src/hotel/entities/hotel.entity.ts (Chỉnh sửa cuối cùng)
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from '../entities/room.entity';

@Entity('hotels')
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    // Cột description bị TypeORM nhầm lẫn -> KHÔNG ĐƯỢC KHAI BÁO (vì không có trong DB gốc của Pro)

    @Column({ name: 'cityId', type: 'int' })
    cityId: number;

    // FIX: policies (varchar) -> TEXT để giảm kích thước hàng
    @Column({ type: 'text', nullable: true })
    policies: string;

    @Column({ name: 'check_in_time', nullable: true })
    checkInTime: string; // Time trong MySQL thường dùng string trong TypeORM

    @Column({ name: 'check_out_time' })
    checkOutTime: string; // Time

    @Column({ name: 'isFeatured', type: 'bit', default: 1 })
    isFeatured: boolean; // bit(1)

    @Column({ name: 'avgPrice', type: 'decimal', precision: 12, scale: 2, nullable: true })
    avgPrice: number;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at' })
    updatedAt: Date;

    // Quan hệ 1-N: Hotel -> Rooms
    @OneToMany(() => Room, (room) => room.hotel)
    rooms: Room[];
}