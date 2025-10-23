import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DiscountType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

export enum CouponStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

@Entity({ name: 'coupons' })
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50})
  code: string;

  @Column({ type: 'enum', enum: DiscountType })
  discountType: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderValue: number|null;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'int', nullable: true })
  usageLimit: number|null;

  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
  status: CouponStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
