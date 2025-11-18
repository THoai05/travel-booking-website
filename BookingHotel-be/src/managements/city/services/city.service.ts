import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';
import { Repository } from 'typeorm';
import { GetAllDataCitiesRequest } from '../dtos/req/GetAllDataCitiesRequest.dto';
import { GetDataCitiesFilterRequest } from '../dtos/req/GetDataCitiesFilterRequest.dto';
import { NearSpot } from '../entities/nearSpot.entity';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';
import { ImagesService } from 'src/managements/images/services/images.service';

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(City)
        private readonly cityRepo: Repository<City>,
        @InjectRepository(NearSpot)
        private readonly nearSpotRepo: Repository<NearSpot>,
        @InjectRepository(Hotel)
        private readonly hotelRepo: Repository<Hotel>,
        private readonly imageService:ImagesService
    ) {
    }

    async getAllDataCities(queryParam:GetAllDataCitiesRequest):Promise<any> {
        try {
        const page = Number(queryParam.page)|1
        const limit = Number(queryParam.limit)|10
        const skip = (page - 1) * limit

            const queryBuilder = await this.cityRepo
            .createQueryBuilder('city')
            .select(['city.id', 'city.title', 'city.image', 'city.description', 'city.isFeatured'])
            .leftJoin('city.hotels','hotels')
            .addSelect([
                'hotels.id',
                'hotels.name',
                'hotels.description',
                'hotels.address',
                'hotels.phone',
                'hotels.policies',
                'hotels.checkInTime',
                'hotels.checkOutTime',
                'hotels.isFeatured'
            ])
            .orderBy('city.id', 'ASC')
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
    
    async getDataCitiesByFilter(queryParam:GetDataCitiesFilterRequest):Promise<any> {
        try {
            const title = queryParam.title

            const queryBuilder = await this.cityRepo
            .createQueryBuilder('city')
            .select(['city.id', 'city.title', 'city.image', 'city.description', 'city.isFeatured'])
            .leftJoin('city.hotels', 'hotels')
            .where('city.title Like :title', { title:`%${title}%`})    
        const [data, total] = await queryBuilder.getManyAndCount()
        return {
              data,total
        }
        } catch (error) {
            throw error
       }
    }

    async findNearSpotByCityId(cityId: number):Promise<any> {
        const dataCityNearSpots = await this.nearSpotRepo.find({
            where: {
                city: {
                    id:cityId
                }
            }
        })
        return dataCityNearSpots
    }

    async getAllDataCitiesTitle() {
        const hotels = await this.cityRepo.find({
            select: {
                id: true,
                title: true,
                image:true
            }
        })
        return hotels
    }

   async getDataCitiesHotelForAccByRegionId(regionId: number): Promise<any> {
    
    // --- BƯỚC 1: TẠO SUBQUERY ĐỂ LẤY 10 ID KHÁCH SẠN TỐT NHẤT ---
    // Subquery này sẽ chạy trước, nó chỉ lấy ra 10 ID
    const subQuery = this.hotelRepo
        .createQueryBuilder('sub_hotel') // Dùng alias khác, ví dụ sub_hotel
        .leftJoin('sub_hotel.city', 'sub_city')
        .leftJoin('sub_hotel.reviews', 'sub_reviews')
        .select('sub_hotel.id') // Chỉ cần lấy ID
        .where('sub_city.regionId = :regionId', { regionId }) // Lọc theo regionId
        .groupBy('sub_hotel.id')
        .orderBy('AVG(sub_reviews.rating)', 'DESC') // Sắp xếp theo rating
        .take(10) // Lấy 10
        .getQuery(); // Lấy ra chuỗi SQL, chứ không chạy

    // --- BƯỚC 2: TẠO QUERY CHÍNH, LẤY DATA DỰA TRÊN 10 ID ĐÓ ---
    const hotels = await this.hotelRepo
        .createQueryBuilder('hotel')
        .leftJoin('hotel.city', 'city')
        .leftJoin('hotel.reviews', 'reviews')
        .select([
            'hotel.id AS id',
            'hotel.name AS name',
            'hotel.address AS address',
            'hotel.avgPrice AS avgPrice',
            'hotel.phone AS phone',
            'city.id AS cityId',
            'city.title AS cityName',
            'AVG(reviews.rating) AS avgRating',
            'COUNT(DISTINCT reviews.id) AS reviewCount',
        ])
        
        // DÙNG SUBQUERY: Chỉ lấy hotel có ID nằm trong 10 ID tốt nhất
        .where(`hotel.id IN (${subQuery})`) 
        
        // Gán biến :regionId cho subQuery bên trong
        .setParameter('regionId', regionId) 

        .groupBy('hotel.id')
        .addGroupBy('hotel.name')
        .addGroupBy('hotel.address')
        .addGroupBy('hotel.avgPrice')
        .addGroupBy('hotel.phone')
        .addGroupBy('city.id')
        .addGroupBy('city.title')

        // SẮP XẾP MỘT LẦN NỮA:
        // Vì WHERE IN không đảm bảo thứ tự, ta phải orderBy lại
        // để 10 record cuối cùng được sắp xếp đúng.
        .orderBy('avgRating', 'DESC')
        .limit(15)
        
        // Không cần .take(10) ở đây nữa vì đã lọc bằng WHERE IN
           .getRawMany();
       
       if (!hotels || hotels.length === 0) {
            return [];
       }
       
       const imagesPromises = hotels.map(hotel => {
           return this.imageService.getImagesByTypeAndId('hotel',hotel.id)
       })

       const imageResults = await Promise.all(imagesPromises);

    const finalResults = hotels.map((h, index) => {
       const hotelImages = imageResults[index].data; 

        let imageUrl = ""; 
        
        if (hotelImages && hotelImages.length > 0) {
            const mainImage = hotelImages.find(img => img.isMain === true);
            
            if (mainImage) {
                imageUrl = mainImage.url;
            } else {
                imageUrl = hotelImages[0].url;
            }
        } 
        return {
            id: h.id,
            name: h.name,
            address: h.address,
            avgPrice: h.avgPrice,
            phone: h.phone,
            city: { id: h.cityId, title: h.cityName },
            avgRating: Number(Number(h.avgRating || 0).toFixed(2)),
            reviewCount: Number(h.reviewCount || 0),
            images: imageUrl
        };
    });
    return finalResults;
}
}
