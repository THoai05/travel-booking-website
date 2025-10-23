import { Module } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CityController } from '../controllers/city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';
import { NearSpot } from '../entities/nearSpot.entity';

@Module({
  imports:[TypeOrmModule.forFeature([City,NearSpot])],
  controllers: [CityController],
  providers: [CityService],
  exports:[CityService]
})
export class CityModule {}
