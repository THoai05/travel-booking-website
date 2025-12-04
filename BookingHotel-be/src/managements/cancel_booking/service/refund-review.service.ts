// src/managements/bookings/refund/refund-review.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { Payment } from 'src/managements/payments/entities/payments.entity';

@Injectable()
export class RefundReviewService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepo: Repository<Booking>,
    ) { }

    private getRefundPercent(checkIn: Date, cancelledAt?: Date) {
        // Nếu đã hủy, dùng thời điểm hủy. Nếu chưa, dùng hiện tại (cho preview)
        const compareTime = cancelledAt ? cancelledAt : new Date();

        const diffDays =
            (checkIn.getTime() - compareTime.getTime()) / (1000 * 60 * 60 * 24);

        if (compareTime >= checkIn) return 0; // Trễ check-in là mất trắng
        if (diffDays >= 7) return 1;          // 100% (dùng số thập phân cho dễ nhân)
        if (diffDays >= 3) return 0.5;        // 50%
        if (diffDays >= 1) return 0.2;        // 20%
        return 0;
    }

    async review(bookingId: number) {
        const booking = await this.bookingRepo.findOne({
            where: { id: bookingId },
            relations: ['payment', 'roomType'],
        });

        if (!booking) throw new NotFoundException('Không tìm thấy booking');
        if (!booking.payment)
            throw new BadRequestException('Booking chưa thanh toán');

        // Set giờ check-in chuẩn (14:00)
        const checkIn = new Date(booking.checkInDate);
        checkIn.setHours(14, 0, 0, 0);

        // FIX: Truyền thêm cancelledAt vào
        const percent = this.getRefundPercent(checkIn, booking.cancelledAt);

        // Tính tiền (Logic cũ ok nhưng tui clean lại xíu)
        const originalAmount = Number(booking.payment.amount);
        const refundAmount = Math.floor(originalAmount * percent); // Dùng floor cho tiền chẵn

        return {
            booking,
            refundPercent: percent * 100, // Đổi ra % hiển thị
            refundAmount,
            originalAmount,
            currency: booking.payment.currency,
            refundable: refundAmount > 0,
        };
    }
}

