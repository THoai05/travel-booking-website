import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PromotionService } from '../services/promotion.service';
import { Coupon } from '../entities/promotion.entity';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: PromotionService) { }

  @Get()
  getAll(): Promise<Coupon[]> {
    return this.couponsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Coupon> {
    return this.couponsService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Coupon>) {
    return this.couponsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<Coupon>) {
    return this.couponsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.couponsService.remove(id);
  }
}
