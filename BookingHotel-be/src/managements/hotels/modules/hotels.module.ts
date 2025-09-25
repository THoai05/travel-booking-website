import { Module } from '@nestjs/common';
import { HotelsService } from '../services/hotels.service';
import { HotelsController } from '../controllers/hotels.controller';

@Module({
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
