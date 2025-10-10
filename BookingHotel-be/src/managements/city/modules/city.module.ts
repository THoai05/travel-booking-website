import { Module } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CityController } from '../controllers/city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';

@Module({
  imports:[TypeOrmModule.forFeature([City])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
