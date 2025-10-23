import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo:Repository<Review>
    ) { }
    
    async getSummaryReviewByHotelId(hotelId: number):Promise<{avgRating:number,reviewCount:number}> {
        const summary = await this.reviewRepo
            .createQueryBuilder('reviews')
            .select([
                'AVG(reviews.rating) AS avgRating',
                'COUNT(reviews.id) AS reviewCount'
            ])
            .where('reviews.hotelId = :hotelId',{hotelId})
            .getRawOne()
        return {
            avgRating: Number(Number(summary?.avgRating || 0).toFixed(2)),
            reviewCount:Number(summary?.reviewCount||0)
        }
    }

    async getReviewsByHotelId(hotelId: number): Promise<{ data: Review[]; total: number }> {
        const query = this.reviewRepo
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .select([
            'review.id',
            'review.rating',
            'review.comment',
            'review.createdAt',
            'user.id',
            'user.username',
            ])
            .where('review.reviewType = :type', { type: 'hotel' })
            .andWhere('review.hotelId = :hotelId', { hotelId })
            .orderBy('review.createdAt', 'DESC');

        const [data, total] = await query.getManyAndCount();

        return { data, total };
    }

}
