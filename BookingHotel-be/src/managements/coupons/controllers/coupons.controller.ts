import { Controller, Get, Param } from '@nestjs/common';
import { CouponsService } from '../services/coupons.service';
import { RandomCouponByTitleRequest } from '../dtos/req/RandomCouponByTitleRequets.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) { }
  
  @Get('random')
  async handleRandomCoupon(@Param() queryParam: RandomCouponByTitleRequest) {
    const { title } = queryParam
    return await this.couponsService.getRandomCouponByCouponType(title)
  }
}
