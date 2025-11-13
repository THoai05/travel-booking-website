import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from "typeorm";
import { RoomType } from "./roomType.entity";
import { Booking } from "src/managements/bookings/entities/bookings.entity";

// Định nghĩa các loại chính sách để quản lý
export enum CancellationPolicyType {
    NON_REFUNDABLE = 'NON_REFUNDABLE',
    FREE_CANCELLATION = 'FREE_CANCELLATION',
    PAY_AT_HOTEL = 'PAY_AT_HOTEL', // Một số chính sách Pay at Hotel có luật hủy riêng
}

export enum PaymentPolicyType {
    PAY_NOW = 'PAY_NOW',
    PAY_AT_HOTEL = 'PAY_AT_HOTEL',
    PAY_LATER = 'PAY_LATER', // Giống như "Log in to pay nothing until..."
}


@Entity()
export class RatePlan {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => RoomType, (roomType) => roomType.ratePlans)
    @JoinColumn({ name: 'room_type_id' }) // Bro nên thêm JoinColumn cho rõ
    roomType: RoomType
    
    @Column({ name: 'room_type_id' }) // Thêm cột này để query cho dễ
    roomTypeId: number

    @Column()
    name: string // VD: "Best Available Rate", "Special for you!"

    // --- PHẦN GÓP Ý VỀ GIÁ ---
    // Bro nên dùng 'decimal' hoặc 'integer' (lưu là 264935)
    // KHÔNG nên dùng 'string' để lưu giá
    @Column({ 
        type: 'decimal', // Hoặc 'bigint' nếu bro lưu VNĐ
        precision: 10, 
        scale: 2, 
        comment: 'Giá gốc (giá bị gạch đi)' 
    })
    original_price: number // VD: 353.247 VND

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2, 
        comment: 'Giá bán (giá đã giảm)' 
    })
    sale_price: number // VD: 264.935 VND

    // --- PHẦN GÓP Ý TIỆN ÍCH / CHÍNH SÁCH ---
    
    @Column({ default: false })
    includes_breakfast: boolean // Trả lời cho "Breakfast not Included"

    @Column({
        type: 'enum',
        enum: PaymentPolicyType,
        default: PaymentPolicyType.PAY_NOW
    })
    payment_policy: PaymentPolicyType // Trả lời cho "Pay at Hotel" / "Pay now"

    @Column({
        type: 'enum',
        enum: CancellationPolicyType,
        default: CancellationPolicyType.NON_REFUNDABLE
    })
    cancellation_policy: CancellationPolicyType // Trả lời cho "Free Cancellation"

    @Column({ 
        nullable: true, 
        type: 'int',
        comment: 'Hủy miễn phí TRƯỚC bao nhiêu ngày so với ngày check-in' 
    })
    cancellation_deadline_days: number // VD: 3 (ngày)
    // Dùng cái này, bro có thể tính ra "until 02 Nov"
    // Ví dụ: User check-in ngày 5/11, deadline = 3
    // => Hủy miễn phí đến 5 - 3 = ngày 2/11.

    @OneToMany(() => Booking, (booking) => booking.rateplan)
    bookings:Booking[]
}