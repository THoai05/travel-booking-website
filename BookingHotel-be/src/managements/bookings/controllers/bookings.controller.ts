import { Body, Controller, Param, ParseIntPipe, Patch, Post, Get, Query } from '@nestjs/common';
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


  @Get('kpi')
  async handleGetKPI(@Query('type') type: 'week' | 'month' | 'year' = 'week') {
    const data = await this.bookingsService.getKPI(type);
    return {
      message: 'success',
      data,
    };
  }

  @Get('kpiAll')
  async handleGetKPIBookingAndCancelledRate(@Query('type') type: 'week' | 'month' | 'year' = 'week') {
    const data = await this.bookingsService.getKPIAll(type);
    return {
      message: 'success',
      data,
    };
  }

  @Get('kpiRevenue')
  async handleGetKPIRevenue(@Query('type') type: 'week' | 'month' | 'year' = 'week') {
    const data = await this.bookingsService.getRevenueKPI(type);
    return {
      message: 'success',
      data,
    };
  }
}
