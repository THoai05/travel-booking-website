import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from '../entities/hotel.entity';
import { Repository } from 'typeorm';
import { GetAllHotelRequest } from '../dtos/req/GetAllHotelRequest.dto';
import { GetDataHotelByIdRequest } from '../dtos/req/GetDataHotelByIdRequest.dto';

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
          
          const queryBuilder = this.hotelRepo
            .createQueryBuilder('hotels')
            .leftJoinAndSelect('hotels.amenities', 'amenities')
            .leftJoinAndSelect('hotels.reviews', 'reviews')
            .leftJoinAndSelect('reviews.user','user')
            .leftJoinAndSelect('hotels.rooms', 'rooms')
            .leftJoinAndSelect('hotels.city', 'city')
            .where('hotels.id = :id', { id })
            .select([
              'hotels.id',
              'hotels.name',
              'hotels.description',
              'hotels.phone',
              'hotels.checkOutTime',
              'hotels.checkInTime',
              'city.id',
              'city.title',
              'amenities.name',
              'amenities.description',
              'user.username',
              'reviews.comment',
              'reviews.rating',
              'rooms.id',                
              'rooms.roomType',
              'rooms.pricePerNight',
              'rooms.maxGuests',
            ])
            .addSelect('AVG(reviews.rating)','avgRating')

           const { entities, raw } = await queryBuilder.getRawAndEntities();
           const hotel = entities[0];

          if (!hotel) {
            throw new NotFoundException("Không tìm thấy khách sạn");
          }

          hotel.avgRating = Number(raw[0].avgRating) || 0;

          return hotel
        } catch (error) {
            console.log(error)
        } 
  }
}
