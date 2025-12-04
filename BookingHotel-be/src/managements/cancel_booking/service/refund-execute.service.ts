// refund-execute.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, RefundStatus } from 'src/managements/payments/entities/payments.entity';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { RefundReviewService } from './refund-review.service';

@Injectable()
export class RefundExecuteService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,

        private readonly refundReview: RefundReviewService,
    ) { }

    private async fakePaymentRefund(method: string, amount: number) {
        await new Promise((res) => setTimeout(res, 500)); // giả delay giống thật

        return {
            success: true,
            refundTransaction: `RF_${Date.now()}`,
            gateway: method,
            refundedAmount: amount,
        };
    }

    async execute(bookingId: number) {
        const preview = await this.refundReview.review(bookingId);
        const booking = preview.booking;

        if (booking.payment.refundStatus === RefundStatus.REFUNDED) {
            throw new BadRequestException('Booking đã hoàn tiền trước đó');
        }

        const gatewayResult = await this.fakePaymentRefund(
            booking.payment.paymentMethod,
            preview.refundAmount,
        );

        // Thực sự đánh dấu refund sau khi fake API thành công
        booking.payment.refundStatus = RefundStatus.REFUNDED;
        await this.paymentRepo.save(booking.payment);

        return {
            message: 'Hoàn tiền thành công ',
            refundAmount: preview.refundAmount,
            refundPercent: preview.refundPercent,
            gateway: gatewayResult.gateway,
            transactionId: gatewayResult.refundTransaction,
        };
    }

}
