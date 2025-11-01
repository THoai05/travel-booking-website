import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Image } from '../../managements/images/entities/image.entity';
import { ImageAttachment } from '../../managements/images/entities/image_attachment.entity';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';
import * as fs from 'fs';
import * as path from 'path';

export default class HotelImageSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const imageRepo = dataSource.getRepository(Image);
    const attachmentRepo = dataSource.getRepository(ImageAttachment);
    const hotelRepo = dataSource.getRepository(Hotel);

    const cityIds = [1, 2, 3, 4, 5, 6];
    const baseUrl = '/hotels';
    const baseDir = path.resolve(__dirname, '../../../../bookinghotel-fe/public/hotels');

    const viDescriptionMap: Record<string, string> = {
      main: 'Ảnh chính khách sạn',
      lobby: 'Sảnh khách sạn',
      bath: 'Phòng tắm',
      bar: 'Quầy bar',
      restaurant: 'Nhà hàng',
      pool: 'Hồ bơi',
      gym: 'Phòng gym',
      spa: 'Khu spa',
      view: 'Quang cảnh',
      nearSpot: 'Địa điểm gần khách sạn',
      room: 'Phòng nghỉ',
    };

    for (const cityId of cityIds) {
      const cityFolder = path.join(baseDir, `city_${cityId}`);
      if (!fs.existsSync(cityFolder)) {
        console.warn(`⚠️ Không tìm thấy thư mục ảnh cho city ${cityId}`);
        continue;
      }

      const files = fs.readdirSync(cityFolder).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
      if (!files.length) {
        console.warn(`⚠️ City ${cityId} không có ảnh nào`);
        continue;
      }

      // Tạo ảnh
      const savedImages = await imageRepo.save(
        files.map((file) => {
          const name = file.split('.')[0];
          const key = Object.keys(viDescriptionMap).find((k) => name.includes(k));
          const description = key ? viDescriptionMap[key] : `Ảnh ${name}`;
          return imageRepo.create({
            url: `${baseUrl}/city_${cityId}/${file}`,
            description,
            isMain: name.includes('main')
          });
        }),
      );

      // Lấy hotel thuộc city này
      const hotels = await hotelRepo.find({ where: { city: { id: cityId } } });
      if (!hotels.length) {
        console.warn(`⚠️ Không tìm thấy hotel nào trong city ${cityId}`);
        continue;
      }

      // Gán tất cả ảnh cho mỗi hotel trong city
      for (const hotel of hotels) {
        const attachments = savedImages.map((img) =>
          attachmentRepo.create({
            image: img,
            targetType: 'hotel',
            targetId: hotel.id,
          }),
        );
        await attachmentRepo.save(attachments);
      }

      console.log(`✅ Seeded ${savedImages.length} ảnh cho city ${cityId} (${hotels.length} hotels)`);
    }

    console.log('🎉 Tất cả ảnh đã được seed thành công!');
  }
}

