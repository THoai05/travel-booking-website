import { Body, Controller, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingRequest } from '../dtos/req/CreateBookingRequest.dto';
import { UpdateBookingRequest } from '../dtos/req/UpdateBookingRequest.dto';

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

  @Patch(':id')
  async handleUpdateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() body:UpdateBookingRequest
  ) {
    console.log(id)
    const updateData = await this.bookingsService.updateBookingForGuests(id, body)
    return {
      message: "success",
      updateData
    }
  }
}
