import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { NearSpot } from '../../managements/city/entities/nearSpot.entity';
import { City } from '../../managements/city/entities/city.entity';

export default class NearSpotSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const nearSpotRepo = dataSource.getRepository(NearSpot);
    const cityRepo = dataSource.getRepository(City);

    const cities = await cityRepo.find();

    if (cities.length === 0) {
      console.warn('⚠️ No cities found! Please run CitySeeder first.');
      return;
    }

    // --- Địa điểm đặc trưng riêng cho từng thành phố ---
    const citySpots: Record<string, string[]> = {
      'Hồ Chí Minh': [
        'Phố đi bộ Nguyễn Huệ',
        'Nhà thờ Đức Bà',
        'Bưu điện Thành phố',
        'Chợ Bến Thành',
        'Cầu Mống',
      ],
      'Hà Nội': [
        'Hồ Hoàn Kiếm',
        'Phố cổ Hà Nội',
        'Văn Miếu Quốc Tử Giám',
        'Lăng Bác',
        'Cầu Long Biên',
      ],
      'Đà Nẵng': [
        'Cầu Rồng',
        'Bãi biển Mỹ Khê',
        'Bán đảo Sơn Trà',
        'Ngũ Hành Sơn',
        'Chợ Hàn',
      ],
      'Đà Lạt': [
        'Hồ Xuân Hương',
        'Thung lũng Tình Yêu',
        'Chợ Đà Lạt',
        'Dinh Bảo Đại',
        'Quảng trường Lâm Viên',
      ],
      'Quảng Ninh': [
        'Vịnh Hạ Long',
        'Bảo tàng Quảng Ninh',
        'Sun World Hạ Long',
        'Cầu Bãi Cháy',
        'Chợ Hạ Long',
      ],
      'Lào Cai': [
        'Núi Fansipan',
        'Thác Bạc',
        'Chợ Sa Pa',
        'Nhà thờ đá Sa Pa',
        'Bản Cát Cát',
      ],
    };

    const nearSpots: NearSpot[] = [];

    for (const city of cities) {
      const spots = citySpots[city.title] || [];

      for (const spotName of spots) {
        const spot = nearSpotRepo.create({
          name: spotName,
          distance: Number((Math.random() * 5 + 0.5).toFixed(1)), // 0.5 - 5.5 km
          city,
        });
        nearSpots.push(spot);
      }
    }

    await nearSpotRepo.save(nearSpots);

    console.log(`✅ Seeded ${nearSpots.length} NearSpots for ${cities.length} cities.`);
  }
}
