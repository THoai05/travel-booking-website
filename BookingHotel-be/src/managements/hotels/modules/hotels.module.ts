import { Module } from '@nestjs/common';
import { HotelsService } from '../services/hotels.service';
import { HotelsController } from '../controllers/hotels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from '../entities/hotel.entity';
import { ReviewsModule } from 'src/managements/reviews/modules/reviews.module';
import { CityModule } from 'src/managements/city/modules/city.module';
import { ImagesModule } from 'src/managements/images/modules/images.module';

@Module({
  imports:[TypeOrmModule.forFeature([Hotel]),ReviewsModule,CityModule,ImagesModule],
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
