import { Module } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { BookingsController } from '../controllers/bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/bookings.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';
import { RatePlan } from 'src/managements/rooms/entities/ratePlans.entity';
import { Coupon } from 'src/managements/coupons/entities/coupons.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Booking,User,RoomType,RatePlan,Coupon])],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports:[BookingsService]
})
export class BookingsModule {}
