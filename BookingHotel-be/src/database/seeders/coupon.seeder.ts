import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {
  Coupon,
  DiscountType,
  CouponStatus,
  CouponType,
} from '../../managements/coupons/entities/coupons.entity';

export default class CouponSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Coupon);

    const prefixList = ['WELCOME', 'SUMMER', 'SALE', 'HOTDEAL', 'FLASH', 'SAVE', 'PROMO', 'FREESHIP'];
    const couponTypeList = [
      CouponType.VNPAY,
      CouponType.MOMO,
      CouponType.ZALOPAY,
      CouponType.STRIPE,
    ];

    const coupons: Partial<Coupon>[] = [];

    for (let i = 0; i < 200; i++) {
      const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];
      const code = `${prefix}${Math.floor(100 + Math.random() * 900)}`;

      const couponType = couponTypeList[Math.floor(Math.random() * couponTypeList.length)];

      const discountType =
        Math.random() > 0.5 ? DiscountType.PERCENT : DiscountType.FIXED;

      const discountValue =
        discountType === DiscountType.PERCENT
          ? Math.floor(Math.random() * 25) + 5 // 5–30%
          : Math.floor(Math.random() * 150000) + 50000; // 50k–200k VNĐ

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) - 2);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 7);

      const minOrderValue =
        Math.random() > 0.5 ? Math.floor(Math.random() * 300000) + 200000 : null;

      const usageLimit =
        Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : null;

      const status = endDate > new Date() ? CouponStatus.ACTIVE : CouponStatus.EXPIRED;

      coupons.push({
        code,
        couponType,
        discountType,
        discountValue,
        minOrderValue,
        startDate,
        endDate,
        usageLimit,
        status,
      });
    }

    await repo.save(coupons);
    console.log(`🌱 Seeded ${coupons.length} coupons successfully!`);
  }
}
