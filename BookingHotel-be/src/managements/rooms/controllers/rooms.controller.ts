import { Controller, Get, Query, Param } from '@nestjs/common';
import { RoomsService } from '../services/rooms.service';


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

  // 2️⃣ Theo khách sạn (id hoặc tên)
  @Get('roomAvailabilityMonitor/byHotel')
  async getByHotel(@Query('search') search: string) {
    return this.roomsService.getRoomsByHotel(search);
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

}
