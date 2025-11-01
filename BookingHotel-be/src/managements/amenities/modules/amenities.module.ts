import { Module } from '@nestjs/common';
import { AmenitiesService } from '../services/amenities.service';
import { AmenitiesController } from '../controllers/amenities.controller';

@Module({
  controllers: [AmenitiesController],
  providers: [AmenitiesService],
})
export class AmenitiesModule {}
