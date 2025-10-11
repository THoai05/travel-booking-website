import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { City } from '../../managements/city/entities/city.entity';

export default class CitySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const cityRepository = dataSource.getRepository(City);

    const cities = [
      { title: 'Hồ Chí Minh', image: '/hcm.png' },
      { title: 'Lào Cai', image: '/laocai.png' },
      { title: 'Hà Nội', image: '/hanoi.png' },
      { title: 'Quảng Ninh', image: '/quangninh.png' },
      { title: 'Đà Nẵng', image: '/danang.png' },
      { title: 'Đà Lạt', image: '/dalat.png' },
    ];

    await cityRepository.save(cities);
  }
}
