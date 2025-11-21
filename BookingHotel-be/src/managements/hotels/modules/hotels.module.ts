import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HotelsController, HotelsManageController } from '../controllers/hotels.controller';

import { HotelsService } from '../services/hotels.service';
import { HotelManageService } from '../services/hotels_manage.service';

import { Hotel } from '../entities/hotel.entity';
import { Amenity } from 'src/managements/amenities/entities/amenities.entity';
import { City } from 'src/managements/city/entities/city.entity';

import { ReviewsModule } from 'src/managements/reviews/modules/reviews.module';
import { CityModule } from 'src/managements/city/modules/city.module';
import { ImagesModule } from 'src/managements/images/modules/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel, Amenity, City]),
    ReviewsModule,   
    CityModule,
    ImagesModule
  ],
  controllers: [HotelsController, HotelsManageController],
  providers: [HotelsService, HotelManageService],
  exports: [HotelsService, HotelManageService]
})
export class HotelsModule { }
