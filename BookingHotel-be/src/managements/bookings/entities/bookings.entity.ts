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
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;


  
  
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
    



  @ManyToOne(() => RoomType, (roomType) => roomType.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomType_id' })
  roomType: RoomType;


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
    type: 'enum',
    enum:BookingStatus,
    default:BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt: Date;

  @Column({ name: 'contact_full_name', type: 'nvarchar',nullable:true })
  contactFullName: string;

  @Column({ name: 'contact_email', type: 'nvarchar',nullable:true })
  contactEmail: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20,nullable:true })
  contactPhone: string;

  // THÔNG TIN KHÁCH (Người sẽ check-in)
  // User tự nhập hoặc tick "Tôi là khách"
  @Column({ name: 'guest_full_name', type: 'nvarchar',nullable:true }) 
  guestFullName: string;

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
