import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    code: string;

    @Column({ type: 'enum', enum: ['active', 'expired'], default: 'active' })
    status: string;

    @Column({ type: 'enum', enum: ['fixed', 'percent'] })
    discountType: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    minOrderValue: number;

    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column({ type: 'int', nullable: true })
    usageLimit: number;

    @CreateDateColumn()
    createdAt: Date;
}
