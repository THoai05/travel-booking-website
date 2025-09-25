import { Module } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { ReviewsController } from '../controllers/reviews.controller';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
