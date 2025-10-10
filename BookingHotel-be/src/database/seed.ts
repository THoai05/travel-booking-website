// src/database/seed.ts
import 'reflect-metadata';
import { AppDataSource } from '../app-datasource';
import { runSeeders } from 'typeorm-extension';
import HotelSeeder from './seeders/hotel.seeder';

async function run() {
  await AppDataSource.initialize();
  console.log('🚀 Database connected');

  await runSeeders(AppDataSource, {
    seeds: [HotelSeeder],
  });

  await AppDataSource.destroy();
  console.log('🌱 Seeding finished!');
}

run().catch((err) => console.error(err));
