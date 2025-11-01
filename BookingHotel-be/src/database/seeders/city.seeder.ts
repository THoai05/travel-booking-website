import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Region } from '../../managements/city/entities/region.entity';
import { City } from '../../managements/city/entities/city.entity';

export default class CitySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const regionRepo = dataSource.getRepository(Region);
    const cityRepo = dataSource.getRepository(City);

    // --- Tạo danh sách vùng ---
    const regions = [
      { title: 'Miền Bắc' },
      { title: 'Miền Trung' },
      { title: 'Miền Nam' },
    ];

    const savedRegions = await regionRepo.save(regions);

    // --- Gán city tương ứng theo vùng ---
    const cities = [
      // Miền Bắc
      {
        title: 'Hà Nội',
        image: '/cities/hanoi.jpg',
        description: 'Thủ đô ngàn năm văn hiến',
        region: savedRegions.find((r) => r.title === 'Miền Bắc'),
      },
      {
        title: 'Lào Cai',
        image: '/cities/laocai.jpg',
        description: 'Vùng núi phía Bắc nổi tiếng với Sa Pa',
        region: savedRegions.find((r) => r.title === 'Miền Bắc'),
      },
      // Miền Trung
      {
        title: 'Đà Nẵng',
        image: '/cities/danang.jpg',
        description: 'Thành phố đáng sống nhất Việt Nam',
        region: savedRegions.find((r) => r.title === 'Miền Trung'),
      },
      {
        title: 'Quảng Ninh',
        image: '/cities/quangninh.jpg',
        description: 'Nổi tiếng với vịnh Hạ Long',
        region: savedRegions.find((r) => r.title === 'Miền Trung'), // bạn có thể chuyển về Bắc nếu muốn
      },
      // Miền Nam
      {
        title: 'Hồ Chí Minh',
        image: '/cities/HoChiMinh.jpg',
        description: 'Trung tâm kinh tế lớn nhất Việt Nam',
        region: savedRegions.find((r) => r.title === 'Miền Nam'),
      },
      {
        title: 'Đà Lạt',
        image: '/cities/dalat.jpg',
        description: 'Thành phố ngàn hoa mộng mơ',
        region: savedRegions.find((r) => r.title === 'Miền Nam'),
      },
      
    ];

    await cityRepo.save(cities);
  }
}
