import { Module } from '@nestjs/common';
import { CouponsService } from '../services/coupons.service';
import { CouponsController } from '../controllers/coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from '../entities/coupons.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Coupon])],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
