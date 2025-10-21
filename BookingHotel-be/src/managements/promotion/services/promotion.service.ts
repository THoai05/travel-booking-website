
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../entities/promotion.entity';

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(Coupon)
        private couponRepo: Repository<Coupon>,
    ) { }

    findAll() {
        return this.couponRepo.find();
    }

    async findOne(id: number) {
        const coupon = await this.couponRepo.findOne({ where: { id } });
        if (!coupon) throw new NotFoundException('Coupon not found');
        return coupon;
    }

    create(data: Partial<Coupon>) {
        const newCoupon = this.couponRepo.create(data);
        return this.couponRepo.save(newCoupon);
    }

    async update(id: number, data: Partial<Coupon>) {
        const coupon = await this.findOne(id);
        Object.assign(coupon, data);
        return this.couponRepo.save(coupon);
    }

    async remove(id: number) {
        const coupon = await this.findOne(id);
        return this.couponRepo.remove(coupon);
    }
}
