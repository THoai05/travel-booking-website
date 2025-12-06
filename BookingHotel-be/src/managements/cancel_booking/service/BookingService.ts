import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from 'src/managements/bookings/entities/bookings.entity';
import { Payment, RefundStatus, PaymentStatus } from 'src/managements/payments/entities/payments.entity';
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
        booking.cancelledAt = new Date(); // Quan trọng: lưu mốc thời gian hủy



        await this.bookingRepo.save(booking);

        return {
            message: "Hủy booking thành công",
            booking,
        };
    }

    async getRefundPreview(bookingId: number) {
        const booking = await this.bookingRepo.findOne({
            where: { id: bookingId },
            relations: ['payment'],
        });

        if (!booking) throw new NotFoundException('Không tìm thấy booking');

        if (!booking.payment) {
            throw new BadRequestException('Booking chưa thanh toán nên không có tiền hoàn');
        }

        const refundAmount = Number(booking.payment.amount);

        return {
            bookingId,
            refundAmount,
        };
    }
}
