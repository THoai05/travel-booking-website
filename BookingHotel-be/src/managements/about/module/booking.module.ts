// src/booking/booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';
import { BookingService } from '../service/booking.service';
import { BookingController } from '../controller/booking.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking, RoomType, Hotel]),
    ],
    controllers: [BookingController],
    providers: [BookingService],
    // Export để RevenueModule có thể dùng lại Repository và Service
    exports: [BookingService, TypeOrmModule.forFeature([Booking, RoomType, Hotel])],
})
export class BookingModuleAbout { }