import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';

export default class HotelSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const hotelFactory = factoryManager.get(Hotel);
    await hotelFactory.saveMany(20); // 👈 tạo 10 record Hotel
  }
}
