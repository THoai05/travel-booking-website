import { Module } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { BookingsController } from '../controllers/bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/bookings.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Booking,User,RoomType])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
