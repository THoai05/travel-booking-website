import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favourite } from '../entities/favourite.entity';
import { User } from '../../../managements/users/entities/users.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Room } from '../../rooms/entities/rooms.entity';
import { Review } from '../../reviews/entities/review.entity';
import { ImageAttachment } from 'src/managements/images/entities/image_attachment.entity';
import { Image } from '../../images/entities/image.entity';


@Injectable()
export class FavouritesService {
    constructor(
        @InjectRepository(Favourite)
        private favouriteRepo: Repository<Favourite>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Hotel)
        private hotelRepo: Repository<Hotel>,

        @InjectRepository(Room)
        private roomRepo: Repository<Room>,

        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
    ) { }

    async findAllByUser(userId: number) {
        return await this.favouriteRepo
            .createQueryBuilder('f')
            .leftJoin('f.hotel', 'hotel')
            .leftJoin('hotel.city', 'city')

            .leftJoin(
                ImageAttachment,
                'ia',
                'ia.targetId = hotel.id AND ia.targetType = :type',
                { type: 'hotel' },
            )
            .leftJoin(Image, 'img', 'img.id = ia.imageId')

            .leftJoin(Review, 'r', 'r.hotelId = hotel.id')

            .select([
                'f.id AS favouriteId',
                'hotel.id AS id',
                'hotel.name AS name',
                'hotel.address AS address',
                'hotel.avgPrice AS avgPrice',
                'hotel.phone AS phone',
                'city.id AS cityId',
                'city.title AS cityTitle',
                'img.url AS imageUrl',
            ])

            .addSelect('AVG(r.rating)', 'avgRating')
            .addSelect('COUNT(r.id)', 'reviewCount')

            .where('f.userId = :userId', { userId })
            .groupBy('hotel.id')
            .orderBy('f.createdAt', 'DESC')
            .getRawMany();
    }


    async create(userId: number, hotelId?: number, roomId?: number) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('User not found');

        if (!hotelId && !roomId) {
            throw new Error('Favourite must have either a hotelId or roomId');
        }

        const favourite = this.favouriteRepo.create({
            user: { id: userId },
            hotel: hotelId ? { id: hotelId } : null,
            room: roomId ? { id: roomId } : null,
            createdAt: new Date(),
        } as any);

        return this.favouriteRepo.save(favourite);
    }

    async remove(id: number) {
        const favourite = await this.favouriteRepo.findOneBy({ id });
        if (!favourite) throw new NotFoundException('Favourite not found');

        return this.favouriteRepo.remove(favourite);
    }

    async getAnalytics() {
        // 1️⃣ Tổng số lượt yêu thích
        const totalFavourites = await this.favouriteRepo.count();

        // 2️⃣ Top khách sạn được yêu thích
        const topHotels = await this.favouriteRepo
            .createQueryBuilder('f')
            .leftJoin('f.hotel', 'hotel')
            .select('hotel.name', 'hotel')
            .addSelect('COUNT(f.id)', 'favourite_count')
            .where('hotel.id IS NOT NULL')
            .groupBy('hotel.id')
            .orderBy('favourite_count', 'DESC')
            .limit(5)
            .getRawMany();

        // 3️⃣ Thống kê theo city
        const locations = await this.favouriteRepo
            .createQueryBuilder('f')
            .leftJoin('f.hotel', 'hotel')
            .leftJoin('hotel.city', 'city') // join city
            .select('city.title', 'title')   // lấy tên city
            .addSelect('COUNT(f.id)', 'count')
            .groupBy('city.id')
            .getRawMany();

        const totalLocationCount = locations.reduce((sum, l) => sum + Number(l.count), 0);

        const locationStats = locations.map((loc) => ({
            location: loc.title, // dùng title city làm location
            count: Number(loc.count),
            percentage: Number(((Number(loc.count) / totalLocationCount) * 100).toFixed(1)),
        }));

        // 4️⃣ Xu hướng (trend) — đếm lượt yêu thích theo ngày gần đây
        const trend = await this.favouriteRepo
            .createQueryBuilder('f')
            .select('DATE(f.createdAt)', 'date')
            .addSelect('COUNT(f.id)', 'count')
            .groupBy('DATE(f.createdAt)')
            .orderBy('DATE(f.createdAt)', 'DESC')
            .limit(7)
            .getRawMany();

        // 5️⃣ Lấy chi tiết danh sách yêu thích (join User + Hotel + Review + City)
        const favourites = await this.favouriteRepo
            .createQueryBuilder('f')
            .leftJoin('f.user', 'user')
            .leftJoin('f.hotel', 'hotel')
            .leftJoin('hotel.city', 'city')  // join city
            .leftJoin('hotel.reviews', 'r')
            .select([
                'f.id AS id',
                'user.username AS user_name',
                'user.email AS user_email',
                'hotel.name AS hotel_name',
                'city.title AS hotel_location', // dùng city title
                'hotel.avgPrice AS hotel_avg_price',
                'AVG(r.rating) AS hotel_rating',
                'f.createdAt AS created_at',
            ])
            .groupBy('f.id')
            .addGroupBy('user.id')
            .addGroupBy('hotel.id')
            .addGroupBy('city.id')
            .orderBy('f.createdAt', 'DESC')
            .limit(10)
            .getRawMany();

        // ✅ Gộp kết quả cuối cùng
        return {
            totalFavourites,
            topHotels: topHotels.map((h) => ({
                hotel: h.hotel,
                favourite_count: Number(h.favourite_count),
            })),
            locations: locationStats,
            trend: trend.map((t) => ({
                date: t.date,
                count: Number(t.count),
            })),
            favourites: favourites.map((f) => ({
                id: f.id,
                user_name: f.user_name,
                user_email: f.user_email,
                hotel_name: f.hotel_name,
                hotel_location: f.hotel_location, // city title
                hotel_avg_price: Number(f.hotel_avg_price),
                hotel_rating: Number(parseFloat(f.hotel_rating || 0).toFixed(1)),
                created_at: f.created_at,
            })),
        };
    }
}
