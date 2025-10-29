import { Module } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { ReviewsController } from '../controllers/reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../../reviews/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService]
})
export class ReviewsModule { }
