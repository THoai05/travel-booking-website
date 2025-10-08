import { Controller, Get, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('user/:id')
  async getUserBookings(@Param('id') userId: number) {
    return this.bookingsService.getUserBookings(userId);
  }
}
