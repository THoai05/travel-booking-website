// src/database/seed.ts
import 'reflect-metadata';
import { AppDataSource } from '../app-datasource';
import { runSeeders } from 'typeorm-extension';
import HotelSeeder from './seeders/hotel.seeder';
import CitySeeder from './seeders/city.seeder';

async function run() {
  await AppDataSource.initialize();
  console.log('🚀 Database connected');

  await runSeeders(AppDataSource, {
    seeds: [CitySeeder,HotelSeeder],
  });

  await AppDataSource.destroy();
  console.log('🌱 Seeding finished!');
}

run().catch((err) => console.error(err));
