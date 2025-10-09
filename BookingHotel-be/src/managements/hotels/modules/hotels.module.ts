import { Module } from '@nestjs/common';
import { HotelsService } from '../services/hotels.service';
import { HotelsController } from '../controllers/hotels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from '../entities/hotel.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Hotel])],
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
