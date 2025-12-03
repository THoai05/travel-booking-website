// src/managements/bookings/booking.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from 'src/managements/bookings/entities/bookings.entity';
import { Payment, RefundStatus } from 'src/managements/payments/entities/payments.entity';
import { CancelBookingDto } from '../dtos/cancel-booking.dto';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepo: Repository<Booking>,

        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
    ) { }

    async cancelBooking(id: number, dto: CancelBookingDto) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['payment'],
        });

        if (!booking) throw new NotFoundException('Booking không tồn tại');

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Booking đã bị hủy trước đó');
        }

        booking.status = BookingStatus.CANCELLED;
        booking.cancellationReason = dto.reason;
        booking.cancelledAt = new Date();

        // Nếu có thanh toán thành công thì đánh dấu refund
        if (booking.payment && booking.payment.paymentStatus === 'success') {
            booking.payment.refundStatus = RefundStatus.REFUNDED;
            await this.paymentRepo.save(booking.payment);
            // TODO: Gọi service thanh toán thực tế nếu có (Momo, VNPAY,...)
        }

        return await this.bookingRepo.save(booking);
    }
}
