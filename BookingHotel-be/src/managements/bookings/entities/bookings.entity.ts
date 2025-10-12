import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { Room } from 'src/managements/rooms/entities/rooms.entity';
import { Payment } from 'src/managements/payments/entities/payments.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;


  
  
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
    



  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;


  @OneToOne(() => Payment, (payment) => payment.booking, { onDelete: 'CASCADE' })
  payment:Payment

  @Column({ name: 'check_in_date', type: 'date', nullable: false })
  checkInDate: Date;

  @Column({ name: 'check_out_date', type: 'date', nullable: false })
  checkOutDate: Date;

  @Column({ name: 'guests_count', type: 'int', nullable: false })
  guestsCount: number;

  @Column({
    name: 'status',
    type: 'nvarchar',
    nullable: false,
  })
  status: BookingStatus;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalPrice: number;

  @Column({ name: 'special_requests', type: 'text', nullable: true })
  specialRequests?: string;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason?: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
