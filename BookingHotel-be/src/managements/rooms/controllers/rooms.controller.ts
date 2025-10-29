import { Controller, Get, Query, Param } from '@nestjs/common';
import { RoomsService } from '../services/rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

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
}
