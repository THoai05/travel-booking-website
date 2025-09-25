import { Module } from '@nestjs/common';
import { HotelStaffService } from '../services/hotel_staff.service';
import { HotelStaffController } from '../controllers/hotel_staff.controller';

@Module({
  controllers: [HotelStaffController],
  providers: [HotelStaffService],
})
export class HotelStaffModule {}
