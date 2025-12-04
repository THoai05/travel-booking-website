// src/managements/bookings/booking.controller.ts

import {
    Controller,
    Get,
    Patch,
    Post,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';

import { CancelBookingDto } from '../dtos/cancel-booking.dto';
import { BookingService } from '../service/BookingService';
import { RefundPreviewService } from '../service/refund-preview.service';
import { RefundReviewService } from '../service/refund-review.service';
import { RefundExecuteService } from '../service/refund-execute.service';

@Controller('bookings')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly refundPreviewService: RefundPreviewService,
        private readonly refundReviewService: RefundReviewService,
        private readonly refundExecuteService: RefundExecuteService,
    ) { }

    // ==========================
    // 1️ Xem trước hoàn tiền
    // ==========================
    @Get(':id/refund-preview')
    async getRefundPreview(@Param('id', ParseIntPipe) id: number) {
        return this.refundPreviewService.getRefundPreview(id);
    }

    // ==========================
    // 2️ Hủy booking
    // ==========================
    @Patch(':id/cancel')
    async cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CancelBookingDto,
    ) {
        return this.bookingService.cancelBooking(id, dto);
    }

    // ========================================================
    // 3️ Thực thi hoàn tiền (gọi fake API của Momo / Stripe)
    // ========================================================
    @Post(':id/refund-execute')
    async executeRefund(@Param('id', ParseIntPipe) id: number) {
        return this.refundExecuteService.execute(id);
    }
}
