import { Controller } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
}
