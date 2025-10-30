import { Module } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CityController } from '../controllers/city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';
import { NearSpot } from '../entities/nearSpot.entity';
import { Hotel } from 'src/managements/hotels/entities/hotel.entity';
import { RegionController } from '../controllers/region.controller';

@Module({
  imports:[TypeOrmModule.forFeature([City,NearSpot,Hotel])],
  controllers: [CityController,RegionController],
  providers: [CityService],
  exports:[CityService]
})
export class CityModule {}
