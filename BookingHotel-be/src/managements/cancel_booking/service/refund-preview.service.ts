// src/managements/bookings/refund/refund-preview.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { Payment } from 'src/managements/payments/entities/payments.entity';
import { RefundReviewService } from './refund-review.service';

@Injectable()
export class RefundPreviewService {
    constructor(private readonly refundReview: RefundReviewService) { }

    async getRefundPreview(bookingId: number) {
        return this.refundReview.review(bookingId);
    }
}

