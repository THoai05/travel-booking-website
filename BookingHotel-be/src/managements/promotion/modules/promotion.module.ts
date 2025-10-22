import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from '../entities/promotion.entity';
import { PromotionService } from '../services/promotion.service';
import { CouponsController } from '../controllers/promotion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])],
  providers: [PromotionService],
  controllers: [CouponsController],
})
export class PromotionModule { }

