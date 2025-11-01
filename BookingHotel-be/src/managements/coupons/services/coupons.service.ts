import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '../entities/coupons.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CouponsService {
    constructor(
        @InjectRepository(Coupon)
        private readonly couponRepo:Repository<Coupon>
    ) {}


    async getRandomCouponByCouponType(title: string|undefined):Promise<any> {
        const queryBuilder = this.couponRepo
            .createQueryBuilder('coupon')
            .select([
                'coupon.id',
                'coupon.code',
                'coupon.discountType',
                'coupon.discountValue',
            ])
            .where('coupon.status = :status', { status: "active" })
            
        if (title) {
            queryBuilder.andWhere(`coupon.couponType = :title`, { title })
        }
        const coupons =  queryBuilder
            .orderBy('RAND()','ASC')
            .limit(3)
            .getMany()
        
        return coupons
    }
}
