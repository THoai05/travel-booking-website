// src/managements/bookings/booking.controller.ts
import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BookingService } from '../service/BookingService';
import { CancelBookingDto } from '../dtos/cancel-booking.dto';

@Controller('bookings')
export class BookingCancelController {
    constructor(private readonly bookingService: BookingService) { }

    @Patch(':id/cancel')
    async cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CancelBookingDto,
    ) {
        return this.bookingService.cancelBooking(id, dto);
    }
}
