import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from '../services/rooms.service';
import { RoomsController } from '../controllers/rooms.controller';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from '../../bookings/entities/bookings.entity';
import { User } from '../../users/entities/users.entity';
import { RoomType } from '../entities/roomType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Hotel, Booking, User, RoomType])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
