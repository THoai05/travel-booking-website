// src/managements/bookings/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { Payment } from 'src/managements/payments/entities/payments.entity';

import { BookingController } from '../controller/booking.controller';

import { BookingService } from '../service/BookingService';
import { RefundPreviewService } from '../service/refund-preview.service';
import { RefundReviewService } from '../service/refund-review.service';
import { RefundExecuteService } from '../service/refund-execute.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking, Payment]),
    ],
    controllers: [BookingController],
    providers: [
        BookingService,
        RefundPreviewService,
        RefundReviewService,
        RefundExecuteService,
    ],
})
export class BookingCancelModule { }
