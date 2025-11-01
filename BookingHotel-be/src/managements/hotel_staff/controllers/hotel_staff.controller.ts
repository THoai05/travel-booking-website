import { Controller } from '@nestjs/common';
import { HotelStaffService } from '../services/hotel_staff.service';

@Controller('hotel-staff')
export class HotelStaffController {
  constructor(private readonly hotelStaffService: HotelStaffService) {}
}
