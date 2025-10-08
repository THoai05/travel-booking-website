import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { Hotel } from '../hotels/entities/hotel.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepo: Repository<Booking>,
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
    @InjectRepository(Hotel)
    private hotelsRepo: Repository<Hotel>,
  ) {}

  async getUserBookings(userId: number) {
    return this.bookingsRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect(Room, 'r', 'r.id = b.room_id')
      .leftJoinAndSelect(Hotel, 'h', 'h.id = r.hotel_id')
      .where('b.user_id = :userId', { userId })
      .select([
        'b.id as id',
        'h.name as hotelName',
        'r.room_number as roomNumber',
        'r.room_type as roomType',
        'b.check_in_date as checkIn',
        'b.check_out_date as checkOut',
        'b.status as status',
        'b.total_price as totalPrice',
      ])
      .getRawMany();
  }
}
