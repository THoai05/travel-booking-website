import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Room } from '../entities/rooms.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { User } from 'src/managements/users/entities/users.entity';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room) private roomsRepo: Repository<Room>,
        @InjectRepository(Hotel) private hotelsRepo: Repository<Hotel>,
        @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
        @InjectRepository(User) private usersRepo: Repository<User>,
    ) { }

    // 1️⃣ Tất cả phòng trên hệ thống
    async getAllRooms() {
        return this.roomsRepo
            .createQueryBuilder('r')
            .leftJoin('r.hotel', 'h')
            .select([
                'r.id AS id',
                'h.name AS hotelName',
                'r.roomNumber AS roomNumber',
                'r.roomType AS roomType',
                'r.status AS status',
                'r.hotel_id AS hotel_id',
            ])
            .orderBy('h.name', 'ASC')
            .addOrderBy('r.roomNumber', 'ASC')
            .getRawMany();
    }

    // 2️⃣ Theo khách sạn (id hoặc tên)
    async getRoomsByHotel(search: string | number) {
        const query = this.roomsRepo
            .createQueryBuilder('r')
            .leftJoinAndSelect(Hotel, 'h', 'h.id = r.hotel_id')
            .select([
                'r.id AS id',
                'h.name AS hotelName',
                'r.roomNumber AS roomNumber',
                'r.roomType AS roomType',
                'r.status AS status',
                'r.hotel_id AS hotel_id',

            ]);

        if (typeof search === 'number' || !isNaN(Number(search))) {
            query.where('h.id = :id', { id: Number(search) }); // ép kiểu sang number
        } else {
            query.where('h.name LIKE :name', { name: `%${search}%` });
        }
        query.orderBy('r.roomNumber', 'ASC');
        return query.getRawMany();
    }


    // 3️⃣ Theo user (lấy các phòng mà user đã đặt)
    async getRoomsByUser(userId: number) {
        return this.bookingRepo
            .createQueryBuilder('b')
            .leftJoin('b.room', 'r')
            .leftJoin('r.hotel', 'h')
            .select([
                'r.id AS id',
                'h.name AS hotelName',
                'r.roomNumber AS roomNumber',
                'r.roomType AS roomType',
                'r.status AS status',
                'b.status AS bookingStatus',
                'b.user_id',
                'r.hotel_id AS hotel_id',
            ])
            .where('b.user_id = :userId', { userId })
            .orderBy('b.check_in_date', 'DESC')
            .getRawMany();
    }

    // 📌 Lấy chi tiết 1 phòng theo id
    async getRoomDetail(roomId: number) {
        const room = await this.roomsRepo.findOne({ where: { id: roomId } });
        return room;
    }

    // 📌 Lấy chi tiết khách sạn theo id
    async getHotelDetail(hotelId: number) {
        const hotel = await this.hotelsRepo.findOne({ where: { id: hotelId } });
        return hotel;
    }
    
}
