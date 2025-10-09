import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from '../entities/hotel.entity';
import { Repository } from 'typeorm';
import { GetAllHotelRequest } from '../dtos/req/GetAllHotelRequest.dto';

@Injectable()
export class HotelsService {

    constructor(
        @InjectRepository(Hotel)
        private readonly hotelRepo: Repository<Hotel>
    ) { }

    async getAllDataHotel(queryParam:GetAllHotelRequest):Promise<any> {
        try {
        const page = Number(queryParam.page)||1
        const limit = Number(queryParam.limit) || 10
        const skip = (page - 1) * limit
        const queryBuilder = this.hotelRepo
            .createQueryBuilder('hotels')
            .skip(skip)
            .take(limit)
        const [data, total] = await queryBuilder.getManyAndCount()
        const totalPages = Math.ceil(total / limit)
        
        return {
            data,total,page,limit,totalPages
        }
        } catch (error) {
            throw error
        }
    }

}
