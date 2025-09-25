import { Module } from '@nestjs/common';
import { PromotionService } from '../services/promotion.service';
import { PromotionController } from '../controllers/promotion.controller';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
