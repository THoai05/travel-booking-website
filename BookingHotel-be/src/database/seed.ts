// src/database/seed.ts
import 'reflect-metadata';
import { AppDataSource } from '../app-datasource';
import { runSeeders } from 'typeorm-extension';
import HotelSeeder from './seeders/hotel.seeder';
import CitySeeder from './seeders/city.seeder';
import UserSeeder from './seeders/users.seeder';
import RoomSeeder from './seeders/room.seeder';
import BookingSeeder from './seeders/bookings.seeder';
import PaymentSeeder from './seeders/payment.seeder';
import ReviewSeeder from './seeders/reviews.seeder';
import CouponSeeder from './seeders/coupon.seeder';
import NotificationSeeder from './seeders/notifications.seeder';
import AmenitySeeder from './seeders/amenities.seeder';
import HotelAmenitiesSeeder from './seeders/hotel_amenities.seeder';
import NearSpotSeeder from './seeders/nearSpot.seeder';
import HotelImageSeeder from './seeders/imagesHotel.seeder';
import FavouriteSeeder from './seeders/favourite.seeder';

async function run() {
  await AppDataSource.initialize();
  console.log('🚀 Database connected');

  await runSeeders(AppDataSource, {
    seeds: [CitySeeder, HotelSeeder, RoomSeeder, UserSeeder, BookingSeeder, PaymentSeeder, ReviewSeeder, CouponSeeder, NotificationSeeder, AmenitySeeder, HotelAmenitiesSeeder, NearSpotSeeder, HotelImageSeeder, FavouriteSeeder],
  });

  await AppDataSource.destroy();
  console.log('🌱 Seeding finished!');
}

run().catch((err) => console.error(err));
