import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../entities/bookings.entity';
import { Repository } from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';
import { CreateBookingRequest } from '../dtos/req/CreateBookingRequest.dto';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(RoomType)
        private readonly roomTypeRepo:Repository<RoomType>,
    ) { }
    
    async createBooking(body: CreateBookingRequest): Promise<CreateBookingManagement>{
        const {
            checkinDate,
            checkoutDate,
            guestsCount,
            totalPrice,
            userId,
            roomTypeId
        } = body
        
        const user = await this.userRepo.findOne({
            where: {
                id:userId
            }
        })
        if (!user) {
            throw new NotFoundException("Khong tim thay nguoi dung")
        }
        const roomType = await this.roomTypeRepo.findOne({
            where: {
                id:roomTypeId
            }
        })
        if (!roomType) {
            throw new NotFoundException("Khong tim thay loai phong nay")
        }
        const bookingData = await this.bookingRepo.create({
            user,
            roomType,
            checkInDate: checkinDate,
            checkOutDate: checkoutDate,
            guestsCount,
            totalPrice
        })
        const bookingSaved = await this.bookingRepo.save(bookingData)
        return {
            bookingId: bookingSaved.id,
            userId: bookingSaved.user.id,
            roomTypeId: bookingSaved.roomType.id,
            checkinDate: bookingSaved.checkInDate,
            checkoutDate: bookingSaved.checkOutDate,
            guestsCount: bookingSaved.guestsCount,
            bedType:bookingSaved.roomType.bed_type,
            roomName:bookingSaved.roomType.name,
            totalPrice:bookingSaved.totalPrice
        }
    }
}
