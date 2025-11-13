import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../entities/coupons.entity';

@Injectable()
export class CouponsService {
    constructor(
        @InjectRepository(Coupon)
        private readonly couponRepo: Repository<Coupon>,
    ) { }

    // 🎯 Lấy coupon ngẫu nhiên theo loại
    async getRandomCouponByCouponType(title?: string): Promise<any[]> {
        const queryBuilder = this.couponRepo
            .createQueryBuilder('coupon')
            .select([
                'coupon.id',
                'coupon.code',
                'coupon.discountType',
                'coupon.discountValue',
            ])
            .where('coupon.status = :status', { status: 'active' });

        if (title) {
            queryBuilder.andWhere('coupon.couponType = :title', { title });
        }
        const coupons =  queryBuilder
            .orderBy('RAND()','ASC')
            .limit(3)
            .getMany()
        return coupons
    }

    //  Phân trang danh sách coupon (cho trang admin)
    async getAllCoupons(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
    ): Promise<{
        data: Coupon[];
        total: number;
        currentPage: number;
        totalPages: number;
    }> {
        const queryBuilder = this.couponRepo.createQueryBuilder('coupon');

        // 🔍 Tìm kiếm theo mã code hoặc loại coupon
        if (search) {
            queryBuilder.andWhere(
                '(coupon.code LIKE :search OR coupon.couponType LIKE :search)',
                { search: `%${search}%` },
            );
        }

        //  Lọc theo trạng thái (active, expired, inactive)
        if (status) {
            queryBuilder.andWhere('coupon.status = :status', { status });
        }

        //  Tính toán phân trang
        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('coupon.createdAt', 'DESC')
            .getManyAndCount();

        return {
            data,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }
}
