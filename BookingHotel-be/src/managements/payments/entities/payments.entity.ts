import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';

export enum PaymentMethod {
  COD = 'cod',
  MOMO = 'momo',
  VNPAY = 'vnpay',
}

export enum PaymentStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

export enum RefundStatus {
  NONE = 'none',
  REFUNDED = 'refunded',
  REJECTED = 'rejected',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @OneToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ name: 'currency', type: 'varchar', length: 10, default: 'vnd' })
  currency: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    nullable: false,
  })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'transaction_id', type: 'varchar', length: 100, unique: true })
  transactionId: string;

  @Column({
    name: 'refund_status',
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.NONE,
  })
  refundStatus: RefundStatus;

  @Column({ name: 'paid_at', type: 'datetime', nullable: true })
  paidAt?: Date|null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
