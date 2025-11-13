import { Controller, Get, Query } from '@nestjs/common';
import { CouponsService } from '../services/coupons.service';
import { RandomCouponByTitleRequest } from '../dtos/req/RandomCouponByTitleRequets.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) { }

  //  GET /coupons/random?title=special
  @Get('random')
  async handleRandomCoupon(@Query() queryParam: RandomCouponByTitleRequest) {
    const { title } = queryParam;
    return await this.couponsService.getRandomCouponByCouponType(title);
  }

  //  GET /coupons?page=1&limit=10&search=SALE&status=active
  @Get()
  async getAllCoupons(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return await this.couponsService.getAllCoupons(+page, +limit, search, status);
  }
}
