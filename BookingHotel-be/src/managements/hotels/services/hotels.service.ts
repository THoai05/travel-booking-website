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
  ) {}

  async getAllDataHotel(queryParam: GetAllHotelRequest): Promise<any> {
    try {
      const page = Number(queryParam.page) || 1;
      const limit = Number(queryParam.limit) || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.hotelRepo
        .createQueryBuilder('hotels')
        .leftJoin('hotels.reviews', 'reviews')
        .leftJoin('hotels.city', 'city')
        .select([
          'hotels.id',
          'hotels.name',
          'city.id',
          'city.title'
        ])
        .addSelect('AVG(reviews.rating)', 'avgRating')
        .addSelect('COUNT(reviews.id)', 'reviewCount')
        .groupBy('hotels.id')
        .addGroupBy('hotels.name')
        .addGroupBy('city.id')
        .addGroupBy('city.title')
        .orderBy('hotels.id', 'DESC')
        .offset(skip)
        .limit(limit);

      const [raw, total] = await Promise.all([
        queryBuilder.getRawMany(),
        this.hotelRepo.count(),
      ]);

      const data = raw.map((item) => ({
        id: item.hotels_id,
        name: item.hotels_name,
        city: {
          id: item.city_id,
          title: item.city_title
        },
        avgRating: item.avgRating ? Number(item.avgRating).toFixed(1) : null,
        reviewCount: Number(item.reviewCount)
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error('getAllDataHotel error:', error);
      throw error;
    }
  }
}
