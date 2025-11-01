import { Module } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { ReviewsController } from '../controllers/reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';
import { UsersModule } from 'src/managements/users/modules/users.module';
import { ReviewLike } from '../entities/review-like.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Module({
  imports: [
     MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads/reviews'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
    TypeOrmModule.forFeature([Review, User, Hotel, ReviewLike])
    , UsersModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService]
})
export class ReviewsModule { }
