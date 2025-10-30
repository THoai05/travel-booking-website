// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { Room
import { Hotel } from '../entities/hotel.entity';
import { BookingService } from '../service/booking.service';
import { BookingController } from '../controller/booking.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking, Room, Hotel]),
    ],
    controllers: [BookingController],
    providers: [BookingService],
    // Export để RevenueModule có thể dùng lại Repository và Service
    exports: [BookingService, TypeOrmModule.forFeature([Booking, Room, Hotel])],
})
export class BookingModuleAbout { }