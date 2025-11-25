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

    // Lưu regions trước để lấy ID gán cho city
    // Dùng upsert hoặc check exist nếu chạy lại nhiều lần để tránh lỗi duplicate
    const savedRegions = await regionRepo.save(regions);

    // --- Gán city tương ứng theo vùng + Tọa độ thực tế ---
    const cities = [
      // --- Miền Bắc ---
      {
        title: 'Hà Nội',
        image: '/cities/hanoi.jpg',
        description: 'Thủ đô ngàn năm văn hiến',
        region: savedRegions.find((r) => r.title === 'Miền Bắc'),
        lat: 21.0285,
        lon: 105.8542,
      },
      {
        title: 'Lào Cai', // Lấy tọa độ trung tâm Sapa cho du lịch
        image: '/cities/laocai.jpg',
        description: 'Vùng núi phía Bắc nổi tiếng với Sa Pa',
        region: savedRegions.find((r) => r.title === 'Miền Bắc'),
        lat: 22.3364,
        lon: 103.8438,
      },
      {
        title: 'Quảng Ninh', // Lấy tọa độ Hạ Long
        image: '/cities/quangninh.jpg',
        description: 'Nổi tiếng với vịnh Hạ Long',
        region: savedRegions.find((r) => r.title === 'Miền Bắc'),
        lat: 20.9599,
        lon: 107.0425,
      },
      {
        title: 'Hải Phòng',
        image: '/cities/haiphong.jpg',
        description: 'Thành phố cảng lớn nhất miền Bắc',
        region: savedRegions.find((r) => r.title === 'Miền Bắc'),
        lat: 20.8449,
        lon: 106.6881,
      },
      {
        title: 'Ninh Bình',
        image: '/cities/ninhbinh.jpg',
        description: 'Nổi tiếng với Tràng An và Tam Cốc',
        region: savedRegions.find((r) => r.title === 'Miền Bắc'),
        lat: 20.2599,
        lon: 105.9753,
      },

      // --- Miền Trung ---
      {
        title: 'Đà Nẵng',
        image: '/cities/danang.jpg',
        description: 'Thành phố đáng sống nhất Việt Nam',
        region: savedRegions.find((r) => r.title === 'Miền Trung'),
        lat: 16.0544,
        lon: 108.2022,
      },
      {
        title: 'Huế',
        image: '/cities/hue.jpg',
        description: 'Thành phố cố đô với quần thể di tích Huế',
        region: savedRegions.find((r) => r.title === 'Miền Trung'),
        lat: 16.4637,
        lon: 107.5909,
      },
      {
        title: 'Quảng Nam', // Lấy tọa độ Phố cổ Hội An
        image: '/cities/quangnam.jpg',
        description: 'Nổi tiếng với Hội An và Mỹ Sơn',
        region: savedRegions.find((r) => r.title === 'Miền Trung'),
        lat: 15.8801,
        lon: 108.3380,
      },
      {
        title: 'Nha Trang',
        image: '/cities/nhatrang.jpg',
        description: 'Thành phố biển nổi tiếng',
        region: savedRegions.find((r) => r.title === 'Miền Trung'),
        lat: 12.2388,
        lon: 109.1967,
      },
      {
        title: 'Phú Yên', // Lấy tọa độ Tuy Hòa
        image: '/cities/phuyen.jpg',
        description: 'Điểm du lịch nổi tiếng sau bộ phim "Tôi thấy hoa vàng trên cỏ xanh"',
        region: savedRegions.find((r) => r.title === 'Miền Trung'),
        lat: 13.0882,
        lon: 109.3149,
      },

      // --- Miền Nam ---
      {
        title: 'Hồ Chí Minh',
        image: '/cities/ho-chi-minh.jpg',
        description: 'Trung tâm kinh tế lớn nhất Việt Nam',
        region: savedRegions.find((r) => r.title === 'Miền Nam'),
        lat: 10.8231,
        lon: 106.6297,
      },
      {
        title: 'Đà Lạt',
        image: '/cities/dalat.jpg',
        description: 'Thành phố ngàn hoa mộng mơ',
        region: savedRegions.find((r) => r.title === 'Miền Nam'),
        lat: 11.9404,
        lon: 108.4583,
      },
      {
        title: 'Cần Thơ',
        image: '/cities/cantho.jpg',
        description: 'Trung tâm vùng đồng bằng sông Cửu Long',
        region: savedRegions.find((r) => r.title === 'Miền Nam'),
        lat: 10.0452,
        lon: 105.7469,
      },
      {
        title: 'Vũng Tàu',
        image: '/cities/vungtau.jpg',
        description: 'Thành phố biển gần TP.HCM, thu hút khách du lịch',
        region: savedRegions.find((r) => r.title === 'Miền Nam'),
        lat: 10.3460,
        lon: 107.0843,
      },
      {
        title: 'Phú Quốc',
        image: '/cities/phuquoc.jpg',
        description: 'Hòn đảo đẹp nhất Việt Nam',
        region: savedRegions.find((r) => r.title === 'Miền Nam'),
        lat: 10.2899,
        lon: 103.9840,
      },
    ];

    await cityRepo.save(cities);
  }
}