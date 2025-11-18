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
  // --- Miền Bắc ---
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
  {
    title: 'Quảng Ninh',
    image: '/cities/quangninh.jpg',
    description: 'Nổi tiếng với vịnh Hạ Long',
    region: savedRegions.find((r) => r.title === 'Miền Bắc'),
  },
  {
    title: 'Hải Phòng',
    image: '/cities/haiphong.jpg',
    description: 'Thành phố cảng lớn nhất miền Bắc',
    region: savedRegions.find((r) => r.title === 'Miền Bắc'),
  },
  {
    title: 'Ninh Bình',
    image: '/cities/ninhbinh.jpg',
    description: 'Nổi tiếng với Tràng An và Tam Cốc',
    region: savedRegions.find((r) => r.title === 'Miền Bắc'),
  },

  // --- Miền Trung ---
  {
    title: 'Đà Nẵng',
    image: '/cities/danang.jpg',
    description: 'Thành phố đáng sống nhất Việt Nam',
    region: savedRegions.find((r) => r.title === 'Miền Trung'),
  },
  {
    title: 'Huế',
    image: '/cities/hue.jpg',
    description: 'Thành phố cố đô với quần thể di tích Huế',
    region: savedRegions.find((r) => r.title === 'Miền Trung'),
  },
  {
    title: 'Quảng Nam',
    image: '/cities/quangnam.jpg',
    description: 'Nổi tiếng với Hội An và Mỹ Sơn',
    region: savedRegions.find((r) => r.title === 'Miền Trung'),
  },
  {
    title: 'Nha Trang',
    image: '/cities/nhatrang.jpg',
    description: 'Thành phố biển nổi tiếng',
    region: savedRegions.find((r) => r.title === 'Miền Trung'),
  },
  {
    title: 'Phú Yên',
    image: '/cities/phuyen.jpg',
    description: 'Điểm du lịch nổi tiếng sau bộ phim "Tôi thấy hoa vàng trên cỏ xanh"',
    region: savedRegions.find((r) => r.title === 'Miền Trung'),
  },

  // --- Miền Nam ---
  {
    title: 'Hồ Chí Minh',
    image: '/cities/ho-chi-minh.jpg',
    description: 'Trung tâm kinh tế lớn nhất Việt Nam',
    region: savedRegions.find((r) => r.title === 'Miền Nam'),
  },
  {
    title: 'Đà Lạt',
    image: '/cities/dalat.jpg',
    description: 'Thành phố ngàn hoa mộng mơ',
    region: savedRegions.find((r) => r.title === 'Miền Nam'),
  },
  {
    title: 'Cần Thơ',
    image: '/cities/cantho.jpg',
    description: 'Trung tâm vùng đồng bằng sông Cửu Long',
    region: savedRegions.find((r) => r.title === 'Miền Nam'),
  },
  {
    title: 'Vũng Tàu',
    image: '/cities/vungtau.jpg',
    description: 'Thành phố biển gần TP.HCM, thu hút khách du lịch',
    region: savedRegions.find((r) => r.title === 'Miền Nam'),
  },
  {
    title: 'Phú Quốc',
    image: '/cities/phuquoc.jpg',
    description: 'Hòn đảo đẹp nhất Việt Nam',
    region: savedRegions.find((r) => r.title === 'Miền Nam'),
  },
];


    await cityRepo.save(cities);
  }
}
