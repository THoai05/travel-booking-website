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

export enum CouponType {
    VNPAY = 'vnpay',
    MOMO = 'momo',
    ZALOPAY = 'zalopay',
    STRIPE = 'stripe',
}

export enum CouponStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
}

@Entity({ name: 'coupons' })
export class Coupon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    code: string;

    // 🔸 Kiểu thanh toán áp dụng
    @Column({ type: 'enum', enum: CouponType })
    couponType: CouponType;

    // 🔸 Loại giảm giá
    @Column({ type: 'enum', enum: DiscountType })
    discountType: DiscountType;

    // 🔸 Giá trị giảm
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    // 🔸 Giá trị đơn hàng tối thiểu để được áp dụng
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    minOrderValue: number | null;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    // 🔸 Giới hạn số lần sử dụng
    @Column({ type: 'int', nullable: true })
    usageLimit: number | null;

    @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
    status: CouponStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
