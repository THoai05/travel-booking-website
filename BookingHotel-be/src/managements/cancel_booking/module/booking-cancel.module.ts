// booking-cancel.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { Payment } from 'src/managements/payments/entities/payments.entity';
import { BookingCancelController } from '../controller/booking.controller';
import { BookingService } from '../service/BookingService';

@Module({
    imports: [TypeOrmModule.forFeature([Booking, Payment])],
    controllers: [BookingCancelController],
    providers: [BookingService],
})
export class BookingCancelModule { }
