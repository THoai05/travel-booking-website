// src/room/entities/room.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';
import { Booking } from '../entities/booking.entity';

@Entity('rooms') // Tên bảng
export class Room {
    @PrimaryGeneratedColumn()
    id: number; // 1. id: int(11) PRIMARY KEY

    @Column({ name: 'hotel_id' })
    hotelId: number; // 2. hotel_id: int(11) - KHÔNG NULL

    @Column({ name: 'room_number' })
    roomNumber: string; // 3. room_number: varchar(255)

    @Column({ name: 'price_per_night', type: 'decimal', precision: 10, scale: 2 })
    pricePerNight: number; // 4. price_per_night: decimal(10,2)

    @Column({ name: 'room_type', length: 255 })
    roomType: string; // 5. room_type: varchar(255)

    @Column({ name: 'max_guests' })
    maxGuests: number; // 6. max_guests: int(11)

    @Column()
    status: string; // 7. status: varchar(255)

    @Column({ type: 'text', nullable: true })
    description: string; // 8. description: text - CÓ NULL

    @Column({ name: 'floor_number', nullable: true })
    floorNumber: number; // 9. floor_number: int(11) - CÓ NULL

    @Column({ name: 'cancellation_policy', type: 'text', nullable: true })
    cancellationPolicy: string; // 10. cancellation_policy: text - CÓ NULL

    @Column({ name: 'created_at' })
    createdAt: Date; // 11. created_at: datetime(6)

    @Column({ name: 'updated_at' })
    updatedAt: Date; // 12. updated_at: datetime(6)

    // --- Khai báo Quan hệ ---
    // Many-to-One: Rooms -> Hotels
    @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
    @JoinColumn({ name: 'hotel_id' })
    hotel: Hotel;

    // One-to-Many: Room -> Bookings
    @OneToMany(() => Booking, (booking) => booking.room)
    bookings: Booking[];
}