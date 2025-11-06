import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { RoomsService } from '../services/rooms.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
  ) { }

  // 1️⃣ Tất cả phòng
  @Get('roomAvailabilityMonitor')
  async getAllRooms() {
    return this.roomsService.getAllRooms();
  }

  // 3️⃣ Theo user
  @Get('roomAvailabilityMonitor/byUser/:userId')
  async getByUser(@Param('userId') userId: number) {
    return this.roomsService.getRoomsByUser(userId);
  }

  // 📌 Lấy chi tiết phòng theo id
  @Get('roomDetail/:id')
  async getRoomDetail(@Param('id') id: number) {
    return this.roomsService.getRoomDetail(id);
  }

  // 📌 Lấy chi tiết khách sạn theo id
  @Get('hotelDetail/:id')
  async getHotelDetail(@Param('id') id: number) {
    return this.roomsService.getHotelDetail(id);
  }

  // 4 Theo user booking
  @Get('getBooKing/byUser/:userId')
  async getBooKingByUser(@Param('userId') userId: number) {
    return this.roomsService.getBookingByUser(userId);
  }

  // 📌 Lấy chi tiết đặt chỗ theo id
  @Get('bookingDetail/:id')
  async getBookingDetail(@Param('id') id: number) {
    return this.roomsService.getBookingDetail(id);
  }

  // 📌 Lấy chi tiết room Type theo id
  @Get('roomTypeDetail/:id')
  async getRoomTypeDetail(@Param('id') id: number) {
    return this.roomsService.getRoomTypeDetail(id);
  }

  // 📌 API lưu hành trình
  @Post('save-trip')
  async saveTrip(@Body('bookingId') bookingId: number) {
    return this.roomsService.saveTripHistory(bookingId);
  }

  // 📌 Đọc lưu hành trình
  @Get('trip-history')
  async tripHistory() {
    return this.roomsService.getTripHistory();
  }

  // 📌 API xóa hành trình
  @Post('remove-trip')
  async removeTrip(@Body('bookingId') bookingId: number) {
    return this.roomsService.removeTripHistory(bookingId);
  }

}
