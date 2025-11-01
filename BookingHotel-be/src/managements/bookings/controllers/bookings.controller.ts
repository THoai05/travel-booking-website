import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingRequest } from '../dtos/req/CreateBookingRequest.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }
  

  @Post('')
  async handleCreateBooking(@Body() body: CreateBookingRequest): Promise<any>{
    const data = await this.bookingsService.createBooking(body)
    return {
      message: "success",
      data
    }
  }
}
