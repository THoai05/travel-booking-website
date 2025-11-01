import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Room } from '../entities/rooms.entity';
import { RoomType } from '../entities/roomType.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { User } from 'src/managements/users/entities/users.entity';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room) private roomsRepo: Repository<Room>,
        @InjectRepository(RoomType) private roomTypeRepo: Repository<RoomType>,
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

    // 3️⃣ Theo user (lấy các phòng mà user đã đặt, không cần Room.id)
    async getRoomsByUser(userId: number) {
        return this.bookingRepo
            .createQueryBuilder('b')
            .innerJoin('b.user', 'u')
            .innerJoin('b.roomType', 'rt')
            .innerJoin('rt.hotel', 'h')
            .innerJoin(Room, 'r', 'r.hotel_id = h.id') // join Room qua hotel
            .select([
                'b.id AS bookingId',
                'b.status AS bookingStatus',
                'b.checkInDate AS checkInDate',
                'b.checkOutDate AS checkOutDate',
                'b.guestsCount AS guestsCount',

                'u.id AS userId',
                'u.fullName AS userName',
                'u.email AS userEmail',

                'r.id AS roomId',
                'r.roomNumber AS roomNumber',
                'r.status AS status',
                'r.roomType AS roomType',
                'r.id AS id',
                'r.hotel_id AS hotel_id',

                'h.id AS hotelId',
                'h.name AS hotelName',

                'rt.id AS roomTypeId',
                'rt.name AS roomTypeName',
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

    // 4. Theo user (lấy các phòng mà user đã đặt, không cần Room.id)
    async getBookingByUser(userId: number) {
        return this.bookingRepo
            .createQueryBuilder('b')
            .innerJoin('b.user', 'u')
            .innerJoin('b.roomType', 'rt')
            .innerJoin('rt.hotel', 'h')
            .innerJoin(Room, 'r', 'r.hotel_id = h.id') // join Room qua hotel
            .select([
                'b.id AS bookingId',//
                'b.status AS bookingStatus',
                'b.checkInDate AS checkInDate',
                'b.checkOutDate AS checkOutDate',
                'b.guestsCount AS guestsCount',
                'b.totalPrice AS totalPrice',
                'b.createdAt AS createdAt',
                'b.updatedAt AS updatedAt',

                'u.id AS userId',
                'u.fullName AS userName',
                'u.email AS userEmail',

                'r.id AS roomId',
                'r.roomNumber AS roomNumber',
                'r.status AS status',
                'r.roomType AS roomType',
                'r.id AS id',//
                'r.hotel_id AS hotel_id',//

                'h.id AS hotelId',
                'h.name AS hotelName',

                'rt.id AS roomTypeId',//
                'rt.name AS roomTypeName',
            ])
            .where('b.user_id = :userId', { userId })
            .orderBy('b.check_in_date', 'DESC')
            .getRawMany();
    }

    // 📌 Lấy chi tiết đặt chỗ theo id
    async getBookingDetail(bookingId: number) {
        const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
        return booking;
    }

    // 📌 Lấy chi tiết đặt room type theo id
    async getRoomTypeDetail(roomTypeId: number) {
        const roomType = await this.roomTypeRepo.findOne({ where: { id: roomTypeId } });
        return roomType;
    }

}
