import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';

export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  SUITE = 'suite',
  DELUXE = 'deluxe',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  MAINTENANCE = 'maintenance',
}

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ name: 'room_number', type: 'varchar', length: 50, nullable: false })
  roomNumber: string;

  @Column({
    name: 'room_type',
    type: 'nvarchar',
    nullable: false,
  })
  roomType: RoomType;

  @Column({ name: 'price_per_night', type: 'decimal', precision: 10, scale: 2, nullable: false })
  pricePerNight: number;

  @Column({ name: 'max_guests', type: 'int', nullable: false })
  maxGuests: number;

  @Column({
    name: 'status',
    type: 'nvarchar',
    nullable: false,
  })
  status: RoomStatus;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'floor_number', type: 'int', nullable: true })
  floorNumber?: number;

  @Column({ name: 'cancellation_policy', type: 'text', nullable: true })
  cancellationPolicy?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
