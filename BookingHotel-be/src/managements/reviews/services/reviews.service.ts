import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { User } from 'src/managements/users/entities/users.entity';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';
import { SubmitRatingDto } from '../dtos/submit-rating.dto';
import { UpdateReviewDto } from '../dtos/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Hotel)
        private readonly hotelRepo: Repository<Hotel>
    ) { }

    async getSummaryReviewByHotelId(hotelId: number): Promise<{ avgRating: number, reviewCount: number }> {
        const summary = await this.reviewRepo
            .createQueryBuilder('reviews')
            .select([
                'AVG(reviews.rating) AS avgRating',
                'COUNT(reviews.id) AS reviewCount'
            ])
            .where('reviews.hotelId = :hotelId', { hotelId })
            .getRawOne()
        return {
            avgRating: Number(Number(summary?.avgRating || 0).toFixed(2)),
            reviewCount: Number(summary?.reviewCount || 0)
        }
    }

    async getReviewsByHotelId(hotelId: number, page = 1, limit = 10): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
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
            .orderBy('review.createdAt', 'DESC')
            .skip((page - 1) * limit) //bỏ các review trước trang hiện tại.
            .take(limit); //lấy số review bằng với limit.

        const [data, total] = await query.getManyAndCount();

        return { data, total, page, limit };
    }


    async createReview(dto: CreateReviewDto, userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        const hotel = await this.hotelRepo.findOne({ where: { id: dto.hotelId } });

        if (!user || !hotel) {
            throw new NotFoundException('User or Hotel not found');
        }

        const review = this.reviewRepo.create({
            user,
            hotel,
            rating: dto.rating,
            comment: dto.comment,
            reviewType: dto.reviewType,
            images: dto.images ? JSON.stringify(dto.images) : null,
        });

        console.log('🟡 [Before Save] Review object:', review);

        const saved = await this.reviewRepo.save(review);

        console.log('🟢 [After Save] Saved review:', saved);

        return saved;
    }

    async updateReview(reviewId: number, dto: UpdateReviewDto, userId: number) {
        const review = await this.reviewRepo.findOne({
            where: { id: reviewId },
            relations: ['user']
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.user.id !== userId) {
            throw new ForbiddenException('You can only update your own review');
        }

        Object.assign(review, dto); // cập nhật rating/comment
        return await this.reviewRepo.save(review);
    }

    async deleteReview(reviewId: number, userId: number) {
        const review = await this.reviewRepo.findOne({
            where: { id: reviewId },
            relations: ['user']
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.user.id !== userId) {
            throw new ForbiddenException('You can only delete your own review');
        }

        return await this.reviewRepo.remove(review);
    }


    async submitRating(dto: SubmitRatingDto, userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        const hotel = await this.hotelRepo.findOne({ where: { id: dto.hotelId } });

        if (!user || !hotel) {
            throw new NotFoundException('User or Hotel not found');
        }

        const review = this.reviewRepo.create({
            user,
            hotel,
            rating: dto.rating,
            reviewType: 'hotel',
        } as DeepPartial<Review>);

        return await this.reviewRepo.save(review);
    }

}
