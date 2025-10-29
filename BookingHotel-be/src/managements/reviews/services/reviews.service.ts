import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { User } from 'src/managements/users/entities/users.entity';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';
import { SubmitRatingDto } from '../dtos/submit-rating.dto';
import { UpdateReviewDto } from '../dtos/update-review.dto';
import { ReviewLike } from '../entities/review-like.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Hotel)
        private readonly hotelRepo: Repository<Hotel>,

        @InjectRepository(ReviewLike)
        private reviewLikeRepo: Repository<ReviewLike>,
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

    async getReviewsByHotelId(
        hotelId: number,
        page = 1,
        limit = 10,
    ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
        const query = this.reviewRepo
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .leftJoin('review.likes', 'likes') // 👈 join bảng review_likes
            .select([
                'review.id',
                'review.rating',
                'review.comment',
                'review.createdAt',
                'user.id',
                'user.username',
            ])
            .addSelect('COUNT(likes.id)', 'likeCount') // 👈 đếm số lượt like
            .where('review.reviewType = :type', { type: 'hotel' })
            .andWhere('review.hotelId = :hotelId', { hotelId })
            .groupBy('review.id') // 👈 group theo review để COUNT hoạt động đúng
            .addGroupBy('user.id')
            .orderBy('review.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [data, total] = await Promise.all([
            query.getRawAndEntities().then(({ raw, entities }) =>
                entities.map((review, i) => ({
                    ...review,
                    likeCount: Number(raw[i].likeCount) || 0, // 👈 merge likeCount vào kết quả
                })),
            ),
            query.getCount(),
        ]);

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

    async deleteReview(id: number, userId: number) {
        const review = await this.reviewRepo.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.user.id !== userId) {
            throw new ForbiddenException('You can only delete your own review');
        }

        await this.reviewRepo.remove(review);
        console.log(`🗑️ [Deleted Review ID]: ${id}`);

        return {
            success: true,
            message: 'Review deleted successfully',
            deletedReviewId: id
        };
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

    async toggleLikeReview(reviewId: number, userId: number) {
        const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
        if (!review) throw new NotFoundException('Review not found');

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const existingLike = await this.reviewLikeRepo.findOne({
            where: { user: { id: userId }, review: { id: reviewId } },
        });

        if (existingLike) {
            await this.reviewLikeRepo.remove(existingLike);
            return { message: 'Unliked review', reviewId };
        } else {
            const newLike = this.reviewLikeRepo.create({ user, review });
            await this.reviewLikeRepo.save(newLike);
            return { message: 'Liked review', reviewId };
        }
    }

    async getReviewLikesCount(reviewId: number) {
        const count = await this.reviewLikeRepo.count({
            where: { review: { id: reviewId } },
        });
        return { reviewId, likeCount: count };
    }

}
