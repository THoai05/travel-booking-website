import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from '../services/rooms.service';
import { RoomsController } from '../controllers/rooms.controller';
import { Room } from '../entities/rooms.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from '../../bookings/entities/bookings.entity';
import { User } from '../../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Hotel, Booking, User])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
