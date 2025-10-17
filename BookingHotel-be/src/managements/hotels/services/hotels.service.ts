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
