import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../entities/bookings.entity';
import { Repository } from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';
import { CreateBookingRequest } from '../dtos/req/CreateBookingRequest.dto';
import { UpdateBookingRequest } from '../dtos/req/UpdateBookingRequest.dto';
import { BookingResponseManagement } from '../interfaces/BookingResponseManagement';

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
    
    async createBooking(body: CreateBookingRequest): Promise<BookingResponseManagement>{
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



    async updateBookingForGuests(bookingId: number, body: UpdateBookingRequest): Promise<BookingResponseManagement> { // de tam thoi
        const {
            contactFullName,
            contactEmail,
            contactPhone,
            guestsFullName
        } = body

        const updateBookingData = await this.bookingRepo.findOne({
            where: {
                id: bookingId
            },
            // THÊM 2 DÒNG NÀY VÀO
            relations: {
                user: true,
                roomType: true
            }
        })

        if (!updateBookingData) {
            throw new NotFoundException("Khong tim thay don hang")
        }

        if (contactFullName !== undefined) {
            updateBookingData.contactFullName = contactFullName
        }

        if (contactEmail !== undefined) {
            updateBookingData.contactEmail = contactEmail
        }

        if (contactPhone !== undefined) {
            updateBookingData.contactPhone = contactPhone
        }

        if (guestsFullName !== undefined) {
            updateBookingData.guestFullName = guestsFullName
        }
        
        const updateBookingSaved = await this.bookingRepo.save(updateBookingData)

        //doan nay se return theo interface h tam thoi return nhu nay trc
        return {
            bookingId: updateBookingSaved.id,
            userId: updateBookingSaved.user.id,
            roomTypeId: updateBookingSaved.roomType.id,
            checkinDate: updateBookingSaved.checkInDate,
            checkoutDate: updateBookingSaved.checkOutDate,
            guestsCount: updateBookingSaved.guestsCount,
            bedType:updateBookingSaved.roomType.bed_type,
            roomName:updateBookingSaved.roomType.name,
            totalPrice: updateBookingSaved.totalPrice,
            contactFullName:updateBookingSaved.contactFullName,
            contactEmail:updateBookingSaved.contactEmail,
            contactPhone: updateBookingSaved.contactPhone,
            guestsFullName: updateBookingSaved.guestFullName
        }
    }


    
}
