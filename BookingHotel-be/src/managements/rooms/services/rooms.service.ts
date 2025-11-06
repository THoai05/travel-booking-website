import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Room } from '../entities/rooms.entity';
import { RoomType } from '../entities/roomType.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { User } from 'src/managements/users/entities/users.entity';
import * as fs from 'fs';
import * as path from 'path';

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
        return this.roomTypeRepo
            .createQueryBuilder('rt')
            .leftJoin('rt.hotel', 'h')
            .select([
                'rt.id AS roomTypeId',
                'rt.name AS roomTypeName',

                'h.id AS hotelId',
                'h.name AS hotelName',             
            ])
            .orderBy('h.name', 'ASC')
            .addOrderBy('rt.id', 'DESC')
            .getRawMany();
    }
    

    // 3️⃣ Theo user (lấy các phòng mà user đã đặt, không cần Room.id)
    async getRoomsByUser(userId: number) {
        return this.bookingRepo
            .createQueryBuilder('b')
            .leftJoin('b.user', 'u')
            .leftJoin('b.roomType', 'rt')
            .leftJoin('rt.hotel', 'h')      
            .select([
                'b.id AS bookingId',
                'b.status AS bookingStatus',
                'b.checkInDate AS checkInDate',
                'b.checkOutDate AS checkOutDate',
                'b.guestsCount AS guestsCount',    

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

    async saveTripHistory(bookingId: number) {
        if (!bookingId) throw new Error('Thiếu bookingId');

        try {
            // Đường dẫn tới frontend
            const dirPath = path.join(
                process.cwd(),
                '..',
                'bookinghotel-fe',
                'src',
                'app',
                'client',
                'rooms',
                'trip-history'
            );
            const filePath = path.join(dirPath, 'trip-history.txt');

            // Tạo thư mục nếu chưa tồn tại
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            let existingIds: Set<string> = new Set();

            // Nếu file đã tồn tại, đọc các ID hiện có
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                const lines = data.split('\n').map(line => line.trim()).filter(line => line);
                existingIds = new Set(lines);
            }

            // Nếu bookingId chưa có, thêm vào
            if (!existingIds.has(bookingId.toString())) {
                existingIds.add(bookingId.toString());
                // Ghi lại toàn bộ ID, mỗi ID 1 dòng
                fs.writeFileSync(filePath, Array.from(existingIds).join('\n') + '\n', 'utf8');
            }

            return {
                message: 'Đã lưu hành trình thành công!',
                filePath,
                bookingId,
            };

        } catch (err: any) {
            console.error('❌ Lỗi lưu trip-history:', err);
            throw new Error(err.message || 'Không thể lưu hành trình');
        }
    }

    async getTripHistory() {
        const filePath = path.join(
            process.cwd(),
            '..',
            'bookinghotel-fe',
            'src',
            'app',
            'client',
            'rooms',
            'trip-history',
            'trip-history.txt'
        );

        if (!fs.existsSync(filePath)) return { bookingIds: [] };

        const data = fs.readFileSync(filePath, 'utf8');
        const bookingIds = data
            .split('\n')
            .map(line => line.trim())
            .filter(line => line); // lọc dòng trống

        return { bookingIds };
    }

    async removeTripHistory(bookingId: number) {
        if (!bookingId) throw new Error('Thiếu bookingId');

        try {
            const filePath = path.join(
                process.cwd(),
                '..',
                'bookinghotel-fe',
                'src',
                'app',
                'client',
                'rooms',
                'trip-history',
                'trip-history.txt'
            );

            if (!fs.existsSync(filePath)) return { message: 'Chưa có hành trình nào' };

            // Đọc các ID hiện có
            const data = fs.readFileSync(filePath, 'utf8');
            const existingIds = new Set(
                data.split('\n').map(line => line.trim()).filter(line => line)
            );

            // Xóa bookingId nếu có
            if (existingIds.has(bookingId.toString())) {
                existingIds.delete(bookingId.toString());
                fs.writeFileSync(filePath, Array.from(existingIds).join('\n') + '\n', 'utf8');
                return { message: 'Đã xóa hành trình thành công', bookingId };
            }

            return { message: 'Hành trình không tồn tại' };
        } catch (err: any) {
            console.error('❌ Lỗi xóa trip-history:', err);
            throw new Error(err.message || 'Không thể xóa hành trình');
        }
    }

}
