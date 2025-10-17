import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';
import { Amenity } from '../../managements/amenities/entities/amenities.entity';

export default class HotelAmenitiesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const hotelRepo = dataSource.getRepository(Hotel);
    const amenityRepo = dataSource.getRepository(Amenity);

    const hotels = await hotelRepo.find();
    const amenities = await amenityRepo.find();

    for (const hotel of hotels) {
      // 🔸 Chọn ngẫu nhiên 4 tiện ích
      const shuffled = amenities.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);

      hotel.amenities = selected;
      await hotelRepo.save(hotel);
    }
  }
}
