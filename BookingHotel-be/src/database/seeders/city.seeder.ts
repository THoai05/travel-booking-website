import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { City } from '../../managements/city/entities/city.entity';

export default class CitySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const cityRepository = dataSource.getRepository(City);

    const cities = [
      { title: 'Hà Nội' },
      { title: 'Hồ Chí Minh' },
      { title: 'Đà Nẵng' },
      { title: 'Nha Trang' },
      { title: 'Cần Thơ' },
      { title: 'Huế' },
      { title: 'Đà Lạt' },
      { title: 'Vũng Tàu' },
      { title: 'Hải Phòng' },
      { title: 'Quảng Ninh' },
    ];

    await cityRepository.save(cities);
  }
}
