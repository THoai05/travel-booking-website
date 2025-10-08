import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Hotel } from '../hotels/entities/hotel.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
    @InjectRepository(Hotel)
    private hotelsRepo: Repository<Hotel>,
  ) {}

  async getAllRooms() {
    return this.roomsRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect(Hotel, 'h', 'h.id = r.hotel_id')
      .select([
        'r.id as id',
        'h.name as hotelName',
        'r.room_number as roomNumber',
        'r.room_type as roomType',
        'r.status as status',
      ])
      .getRawMany();
  }
}
