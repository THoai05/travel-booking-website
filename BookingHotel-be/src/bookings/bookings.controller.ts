import { Controller, Get, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('user/:id')
  async getUserBookings(@Param('id') userId: number) {
    return this.bookingsService.getUserBookings(userId);
  }
  
	  // API mới: đọc tất cả booking của user
	@Get('all/:id')
	async getAllUserBookings(@Param('id') userId: number) {
	  return this.bookingsService.getAllUserBookings(userId);
	}

  
}
