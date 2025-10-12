import { Module } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { BookingsController } from '../controllers/bookings.controller';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
