import { Module } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { ReviewsController } from '../controllers/reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';
import { UsersModule } from 'src/managements/users/modules/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Hotel])
    , UsersModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService]
})
export class ReviewsModule { }
