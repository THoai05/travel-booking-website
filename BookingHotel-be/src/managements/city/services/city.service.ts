import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';
import { Repository } from 'typeorm';
import { GetAllDataCitiesRequest } from '../dtos/req/GetAllDataCitiesRequest.dto';

@Injectable()
export class CityService {
    constructor(@InjectRepository(City)
                private readonly cityRepo:Repository<City>) {
    }

    async getAllDataCities(queryParam:GetAllDataCitiesRequest):Promise<any> {
        try {
        const page = Number(queryParam.page)|1
        const limit = Number(queryParam.limit)|10
        const skip = (page - 1) * limit

        const queryBuilder = await this.cityRepo
            .createQueryBuilder('city')
            .select(['city.id', 'city.title', 'city.image', 'city.description'])
            .leftJoin('city.hotels','hotels')
            .addSelect([
                'hotels.name',
                'hotels.description',
                'hotels.address',
                'hotels.phone',
                'hotels.policies',
                'hotels.checkInTime',
                'hotels.checkOutTime'
            ])
            .orderBy('city.id','ASC')
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
