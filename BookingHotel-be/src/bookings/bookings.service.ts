import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepo: Repository<Booking>,
  ) {}

  // Chức năng cũ
  async getUserBookings(userId: number) {
    return this.bookingsRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.room', 'r')
      .leftJoinAndSelect('r.hotel', 'h')
      .where('b.user_id = :userId', { userId })
      .select([
        'b.id AS id',
        'h.name AS hotelName',
        'r.room_number AS roomNumber',
        'r.room_type AS roomType',
        'b.check_in_date AS checkIn',
        'b.check_out_date AS checkOut',
        'b.status AS status',
        'b.total_price AS totalPrice',
      ])
      .getRawMany();
  }

	// API đọc dữ liệu đơn giản, chỉ trả tất cả booking của user
	async getAllUserBookings(userId: number) {
	  return this.bookingsRepo.find({
		where: { user_id: userId },
		relations: ['room', 'room.hotel'], // join để lấy thông tin room + hotel
	  });
	}
	

}
