// src/database/seed.ts
import 'reflect-metadata';
import { AppDataSource } from '../app-datasource';
import { runSeeders } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import HotelSeeder from './seeders/hotel.seeder';
import CitySeeder from './seeders/city.seeder';
import UserSeeder from './seeders/users.seeder';
import RoomSeeder from './seeders/room.seeder';
import PaymentSeeder from './seeders/payment.seeder';
import ReviewSeeder from './seeders/reviews.seeder';
import CouponSeeder from './seeders/coupon.seeder';
import NotificationSeeder from './seeders/notifications.seeder';
import AmenitySeeder from './seeders/amenities.seeder';
import HotelAmenitiesSeeder from './seeders/hotel_amenities.seeder';
import NearSpotSeeder from './seeders/nearSpot.seeder';
import HotelImageSeeder from './seeders/imagesHotel.seeder';
import FavouriteSeeder from './seeders/favourite.seeder';
import FaqSeeder from './seeders/faq.seeder';
import { Faq } from 'src/managements/faq/entities/faq.entity';
import BookingSeeder from './seeders/bookings.seeder';
import PostSeeder from './seeders/post.seeder';

async function clearDatabase(dataSource: DataSource) {
  const entities = dataSource.entityMetadatas;
  console.log('🧹 Clearing database...');

  // Tắt kiểm tra khóa ngoại để tránh lỗi khi xóa theo thứ tự ngẫu nhiên
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
  }

  // Bật lại kiểm tra khóa ngoại
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

  console.log('✅ All tables truncated');
}

async function run() {
  await AppDataSource.initialize();
  console.log('🚀 Database connected');

  // 🧹 Xóa sạch dữ liệu
  await clearDatabase(AppDataSource);

  // 🌱 Chạy seeders
  await runSeeders(AppDataSource, {
    seeds: [CitySeeder, HotelSeeder, RoomSeeder, UserSeeder,BookingSeeder, PaymentSeeder, ReviewSeeder, CouponSeeder, NotificationSeeder, AmenitySeeder, HotelAmenitiesSeeder, NearSpotSeeder, HotelImageSeeder, FavouriteSeeder, FaqSeeder,PostSeeder],
  });

  await AppDataSource.destroy();
  console.log('🌱 Seeding finished!');
}

run().catch((err) => console.error(err));
