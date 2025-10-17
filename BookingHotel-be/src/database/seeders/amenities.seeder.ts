import { DataSource } from 'typeorm';
import { Amenity } from '../../managements/amenities/entities/amenities.entity';
import { Seeder } from 'typeorm-extension';

export default class AmenitySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Amenity);

    const amenities = [
      { name: 'WiFi miễn phí', description: 'Tốc độ cao 100Mbps' },
      { name: 'Nhà hàng 24h', description: 'Ăn uống bất cứ lúc nào' },
      { name: 'Phòng gym', description: 'Trang thiết bị hiện đại' },
      { name: 'Điều hòa cao cấp', description: 'Thoải mái cả ngày' },
      { name: 'Hồ bơi', description: 'Hồ bơi sạch sẽ và rộng rãi' },
      { name: 'Dịch vụ đưa đón sân bay', description: 'Thuận tiện di chuyển' },
      { name: 'Bãi đậu xe miễn phí', description: 'Rộng rãi, an toàn' },
      { name: 'Quầy bar', description: 'Thư giãn với đồ uống ngon' },
      { name: 'Lễ tân 24/7', description: 'Hỗ trợ bạn mọi lúc' },
      { name: 'Spa & Massage', description: 'Thư giãn cơ thể và tinh thần' },
    ];

    await repo.insert(amenities);
  }
}
