import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from '../entities/hotel.entity';
import { Repository } from 'typeorm';
import { GetAllHotelRequest } from '../dtos/req/GetAllHotelRequest.dto';
import { GetDataHotelByIdRequest } from '../dtos/req/GetDataHotelByIdRequest.dto';
import { HotelDetailResponse } from '../dtos/res/HotelDetailResponse.dto';
import { plainToInstance } from 'class-transformer';
import { Amenity } from 'src/managements/amenities/entities/amenities.entity';
import { HotelAmenitiesResponse } from '../interfaces/HotelAmenities.interface';
import { ReviewsService } from 'src/managements/reviews/services/reviews.service';
import { CityService } from 'src/managements/city/services/city.service';
import { ImagesService } from 'src/managements/images/services/images.service';

@Injectable()
export class HotelsService {

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepo: Repository<Hotel>,
    private readonly reviewsService: ReviewsService,
    private readonly cityService: CityService,
    private readonly imageService:ImagesService
  ) { }

  async getAllDataHotel(queryParam: GetAllHotelRequest): Promise<any> {
    try {
      console.log(queryParam)
      const page = Number(queryParam.page) || 1;
      const limit = Number(queryParam.limit) || 10;
      const star = Number(queryParam.star);
      const amenities = queryParam.amenities ? queryParam.amenities.map(a => a.trim()) : [];
      const { minPrice, maxPrice, hotelName, cityTitle } = queryParam;
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
        .addSelect('GROUP_CONCAT(DISTINCT amenities.name)', 'amenityList')
        .groupBy('hotels.id')
        .addGroupBy('city.id');
    

      // (Các filter cũ...)
      if (minPrice) {
        queryBuilder.andWhere(`hotels.avgPrice >= :minPrice`, { minPrice });
      }

      if (maxPrice) {
        queryBuilder.andWhere(`hotels.avgPrice <= :maxPrice`, { maxPrice });
      }

      // ✅ --- THÊM FILTER CITY TITLE ---
      // (Giả sử bro truyền 'cityTitle' từ DTO)
      if (cityTitle) {
        queryBuilder.andWhere('city.title = :cityTitle', { cityTitle });
      }

      // ✅ --- THÊM FILTER HOTEL NAME ---
      // (Giả sử bro truyền 'hotelName' từ DTO, dùng ILIKE để tìm kiếm không phân biệt hoa thường)
      if (hotelName) {
        // MySQL không có ILIKE, dùng LIKE
        // Dùng LOWER() để đảm bảo tìm kiếm không phân biệt hoa thường
        queryBuilder.andWhere('LOWER(hotels.name) LIKE LOWER(:hotelName)', { hotelName: `%${hotelName}%` });
      }

      if (amenities.length > 0) {
        queryBuilder.andWhere('amenities.name IN (:...amenities)', { amenities });
        queryBuilder.having('COUNT(DISTINCT amenities.id) >= :amenitiesCount', {
          amenitiesCount: amenities.length,
        });
      }

      if (star) {
      let minStar: number;
      let maxStar: number;

      if (star === 1) {
        minStar = 0;
        maxStar = 1.49;
      } else if (star === 5) {
        minStar = 4.5;
        maxStar = 5.0;
      } else {
        minStar = star - 0.5;
        maxStar = star + 0.49;
      }
      
      queryBuilder.andHaving('AVG(reviews.rating) BETWEEN :minStar AND :maxStar', {
        minStar: minStar,
        maxStar: maxStar,
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
          avgPrice: item.hotels_avgPrice,
          city: {
            id: item.city_id,
            title: item.city_title,
          },
          avgRating: item.avgRating ? Number(item.avgRating).toFixed(1) : null,
          reviewCount: Number(item.reviewCount),
          amenities: item.amenityList
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

  async getHotelDataById(hotelId:number) {
      const [hotel, summaryReview,images] = await Promise.all([
        this.findBasicInfoHotel(hotelId),
        this.reviewsService.getSummaryReviewByHotelId(hotelId),
        this.imageService.getImagesByTypeAndId("hotel",hotelId)
      ]);
      const nearSpot = await this.cityService.findNearSpotByCityId(hotel.city.id)
    return {
      ...hotel,
      summaryReview,
      nearSpot,
      images
    };
  }

    
  async findBasicInfoHotel(hotelId: number): Promise<Hotel> {
    const hotel = await this.hotelRepo
      .createQueryBuilder('hotel')
      .leftJoin('hotel.city', 'city')
      .leftJoin('hotel.amenities', 'amenities')
      .select([
        'hotel.id',
        'hotel.name',
        'hotel.description',
        'hotel.address',
        'hotel.phone',
        'hotel.avgPrice',
        'city.id',
        'city.title',
        'amenities.name',
        'amenities.description'
      ])
      .where('hotel.id = :hotelId', { hotelId })
      .getOne()
    if (!hotel) {
      throw new NotFoundException("Khong tim thay khach san")
    }
    return hotel
  }

 async getSimilarHotelByCityId(cityId: number): Promise<any[]> {
  const hotels = await this.hotelRepo
    .createQueryBuilder('hotels')
    .leftJoin('hotels.city', 'city')
    .leftJoin('reviews', 'reviews', 'reviews.hotelId = hotels.id')
    .select([
      'hotels.id AS id',
      'hotels.name AS name',
      'hotels.address AS address',
      'hotels.avgPrice AS avgPrice',
      'hotels.phone AS phone',
      'city.id AS cityId',
      'city.title AS cityName',
      'AVG(reviews.rating) AS avgRating',
      'COUNT(reviews.id) AS reviewCount',
    ])
    .where('city.id = :cityId', { cityId })
    .groupBy('hotels.id')
    .addGroupBy('city.id')
    .addGroupBy('city.title')
    .getRawMany();

  // ép kiểu
  return hotels.map(h => ({
    id: h.id,
    name: h.name,
    address: h.address,
    avgPrice: h.avgPrice,
    phone:h.phone,
    city: { id: h.cityId, title: h.cityName },
    avgRating: Number(Number(h.avgRating || 0).toFixed(2)),
    reviewCount: Number(h.reviewCount || 0)
  }));
}
async getDataCitiesHotelForAccByRegionId(regionId: number): Promise<any> {
const hotels = await this.hotelRepo // <-- BẮT ĐẦU TỪ HOTEL
    .createQueryBuilder('hotel') // Alias là 'hotel'
    .leftJoin('hotel.city', 'city') // Join vào city
    .leftJoin('hotel.reviews', 'reviews') // Join vào reviews

    .select([
        'hotel.id AS id', // Dùng alias 'hotel'
        'hotel.name AS name',
        'hotel.address AS address',
        'hotel.avgPrice AS avgPrice',
        'hotel.phone AS phone',
        'city.id AS cityId', // Dùng alias 'city'
        'city.title AS cityName',
        'AVG(reviews.rating) AS avgRating',
        'COUNT(DISTINCT reviews.id) AS reviewCount',
    ])
    .where('city.regionId = :regionId', { regionId }) // Lọc trên city đã join

    // Group by tất cả các cột không phải aggregate
    .groupBy('hotel.id')
    .addGroupBy('hotel.name')
    .addGroupBy('hotel.address')
    .addGroupBy('hotel.avgPrice')
    .addGroupBy('hotel.phone')
    .addGroupBy('city.id')
    .addGroupBy('city.title')

    .getRawMany();

// Phần map vẫn y hệt
return hotels.map(h => ({
    id: h.id,
    name: h.name,
    address: h.address,
    avgPrice: h.avgPrice,
    phone: h.phone,
    city: { id: h.cityId, title: h.cityName },
    avgRating: Number(Number(h.avgRating || 0).toFixed(2)),
    reviewCount: Number(h.reviewCount || 0)
}));
}
 
}
