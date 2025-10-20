import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from '../entities/hotel.entity';
import { Repository } from 'typeorm';
import { GetAllHotelRequest } from '../dtos/req/GetAllHotelRequest.dto';
import { GetDataHotelByIdRequest } from '../dtos/req/GetDataHotelByIdRequest.dto';
import { HotelDetailResponse } from '../dtos/res/HotelDetailResponse.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HotelsService {

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>
  ) {}

  async getAllDataHotel(queryParam: GetAllHotelRequest): Promise<any> {
    try {
    console.log(queryParam)
    const page = Number(queryParam.page) || 1;
    const limit = Number(queryParam.limit) || 10;
    const star = Number(queryParam.star);
    const amenities = queryParam.amenities ? queryParam.amenities.map(a => a.trim()) : [];
    const { minPrice, maxPrice } = queryParam;
    const skip = (page - 1) * limit;

    const queryBuilder = this.hotelRepo
      .createQueryBuilder('hotels')
      .leftJoin('hotels.reviews', 'reviews')
      .leftJoin('hotels.city', 'city')
      .leftJoin('hotels.amenities', 'amenities')
      .select([
        'hotels.id',
        'hotels.name',
        'hotels.avgPrice',
        'city.id',
        'city.title'
      ])
      .addSelect('AVG(reviews.rating)', 'avgRating')
      .addSelect('COUNT(reviews.id)', 'reviewCount')
      .groupBy('hotels.id')
      .addGroupBy('hotels.name')
      .addGroupBy('city.id')
      .addGroupBy('city.title');

    if (minPrice) {
      queryBuilder.andWhere(`hotels.avgPrice >= :minPrice`, { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere(`hotels.avgPrice <= :maxPrice`, { maxPrice });
    }

    if (amenities.length > 0) {
      queryBuilder.andWhere('amenities.name IN (:...amenities)', { amenities });
      queryBuilder.having('COUNT(DISTINCT amenities.id) >= :amenitiesCount', {
        amenitiesCount: amenities.length,
      });
    }

    if (star) {
      queryBuilder.andHaving('AVG(reviews.rating) BETWEEN :minStar AND :maxStar', {
        minStar: star - 1,
        maxStar: star,
      });
    }

    const countQuery = queryBuilder.clone();
    countQuery.skip(undefined).take(undefined);
    const allRecords = await countQuery.getRawMany();
    const total = allRecords.length;

    const paginated = allRecords.slice(skip, skip + limit);

    return {
      data: paginated.map(item => ({
        id: item.hotels_id,
        name: item.hotels_name,
        avgPrice:item.hotels_avgPrice,
        city: {
          id: item.city_id,
          title: item.city_title,
        },
        avgRating: item.avgRating ? Number(item.avgRating).toFixed(1) : null,
        reviewCount: Number(item.reviewCount),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('getAllDataHotel error:', error);
    throw error;
  }
}

    
    async getDataHotelById(id:number): Promise<any>{
        try {
          
          const hotel = await this.hotelRepo.findOne({
  where: { id },
  relations: ['city', 'rooms', 'amenities', 'reviews', 'reviews.user'],
});
if (!hotel) throw new NotFoundException('Không tìm thấy khách sạn');

const avgRating =
  hotel.reviews.length > 0
    ? hotel.reviews.reduce((acc, r) => acc + r.rating, 0) / hotel.reviews.length
    : 0;

const response = plainToInstance(HotelDetailResponse, {
  ...hotel,
  avgRating: Number(avgRating.toFixed(2)),
});
return response;
        } catch (error) {
            console.log(error)
        } 
  }
}
