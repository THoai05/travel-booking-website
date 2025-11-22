import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';
import { CreateHotelDto } from '../dtos/res/create-hotel.dto';
import { UpdateHotelDto } from '../dtos/res/update-hotel.dto';
import { Amenity } from 'src/managements/amenities/entities/amenities.entity';
import { City } from '../../city/entities/city.entity';

@Injectable()
export class HotelManageService {
    constructor(
        @InjectRepository(Hotel)
        private hotelRepo: Repository<Hotel>,

        @InjectRepository(Amenity)
        private amenityRepo: Repository<Amenity>,

        @InjectRepository(City)
        private cityRepo: Repository<City>,
    ) { }

    // CREATE HOTEL
    async create(dto: CreateHotelDto) {
        const city = await this.cityRepo.findOneBy({ id: dto.cityId });

        if (!city) throw new NotFoundException('City không tồn tại');

        // Map amenities
        let amenities: Amenity[] = [];

        const amenityIds = dto.amenities ?? [];

        if (amenityIds.length > 0) {
            amenities = await this.amenityRepo.find({
                where: { id: In(amenityIds) },
            });
        }

        const hotel = this.hotelRepo.create({
            ...dto,
            amenities,
            city,
        });

        return await this.hotelRepo.save(hotel);
    }

    // GET ALL + PAGINATION + RELATIONS
    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.hotelRepo.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
            relations: ['city', 'amenities', 'roomTypes'],
            order: { createdAt: 'DESC' },
        });

        return {
            data,
            page,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
        };
    }

    // GET ONE
    async findOne(id: number) {
        const hotel = await this.hotelRepo.findOne({
            where: { id },
            relations: ['city', 'amenities', 'roomTypes', 'reviews', 'rooms'],
        });

        if (!hotel) throw new NotFoundException('Hotel không tồn tại');

        return hotel;
    }

    // UPDATE
    async update(id: number, dto: UpdateHotelDto) {
        const hotel = await this.findOne(id);

        // Update amenities nếu có gửi vào
        let amenities;
        if (dto.amenities) {
            amenities = await this.amenityRepo.find({
                where: { id: In(dto.amenities) },
            });
        }

        const updated = this.hotelRepo.merge(hotel, {
            ...dto,
            amenities: amenities ?? hotel.amenities,
        });

        return this.hotelRepo.save(updated);
    }

    // DELETE
    async remove(id: number) {
        await this.findOne(id);
        await this.hotelRepo.delete({ id });
        return { message: 'Xoá khách sạn thành công' };
    }
}
