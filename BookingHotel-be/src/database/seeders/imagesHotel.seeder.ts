import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Image } from '../../managements/images/entities/image.entity';
import { ImageAttachment } from '../../managements/images/entities/image_attachment.entity';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';
import { RoomType, RoomTypeName } from '../../managements/rooms/entities/roomType.entity';

import * as fs from 'fs';
import * as path from 'path';

export default class HotelImageSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const imageRepo = dataSource.getRepository(Image);
    const attachmentRepo = dataSource.getRepository(ImageAttachment);
    const hotelRepo = dataSource.getRepository(Hotel);
    const roomTypeRepo = dataSource.getRepository(RoomType);

    /* =====================================================
        PHẦN 1: SEED ẢNH CHO HOTEL (giữ nguyên logic cũ)
    ===================================================== */

    const cityIds = [1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15];
    const hotelBaseDir = path.resolve(__dirname, '../../../../bookinghotel-fe/public/hotels');
    const baseHotelUrl = '/hotels';

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
      const cityFolder = path.join(hotelBaseDir, `city_${cityId}`);
      if (!fs.existsSync(cityFolder)) continue;

      const files = fs.readdirSync(cityFolder).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
      if (!files.length) continue;

      const savedImages = await imageRepo.save(
        files.map((file) => {
          const name = file.split('.')[0];
          const key = Object.keys(viDescriptionMap).find((k) => name.includes(k));
          const description = key ? viDescriptionMap[key] : `Ảnh ${name}`;

          return imageRepo.create({
            url: `${baseHotelUrl}/city_${cityId}/${file}`,
            description,
            isMain: name.includes('main'),
          });
        })
      );

      const hotels = await hotelRepo.find({ where: { cityId } });
      if (!hotels.length) continue;

      for (const hotel of hotels) {
        const attachments = savedImages.map((img) =>
          attachmentRepo.create({
            image: img,
            targetType: 'hotel',
            targetId: hotel.id,
          })
        );
        await attachmentRepo.save(attachments);
      }

      console.log(`🏨 Seeded ${savedImages.length} ảnh khách sạn cho city_${cityId}`);
    }

    /* =====================================================
        PHẦN 2: SEED ẢNH CHO ROOMTYPE
        - dùng folder /public/room
        - mỗi loại phòng dùng chung với mọi hotel
    ===================================================== */

    const roomBaseDir = path.resolve(__dirname, '../../../../bookinghotel-fe/public/room');
    const baseRoomUrl = '/room';

    if (!fs.existsSync(roomBaseDir)) {
      console.warn("⚠️ Không tìm thấy folder /public/room");
      return;
    }

    const roomFolders = fs.readdirSync(roomBaseDir);

    for (const folder of roomFolders) {
      const folderPath = path.join(roomBaseDir, folder);

      const files = fs.readdirSync(folderPath).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
      if (!files.length) continue;

      // Map folder name → RoomTypeName enum
      const normalize = (str: string) =>
        str.replace(/\s+/g, "").toLowerCase();

      const enumKey = Object.keys(RoomTypeName).find(
        (key) => normalize(RoomTypeName[key]) === normalize(folder)
      );

      if (!enumKey) {
        console.warn(`⚠️ Folder '${folder}' không khớp enum RoomTypeName`);
        continue;
      }

      const roomTypeName = RoomTypeName[enumKey];

      // Lấy tất cả roomType thuộc loại này
      const roomTypes = await roomTypeRepo.find({ where: { name: roomTypeName } });

      if (!roomTypes.length) {
        console.warn(`⚠️ Không tìm thấy RoomType nào có name = ${roomTypeName}`);
        continue;
      }

      // Save images
      const savedImages = await imageRepo.save(
        files.map((file) =>
          imageRepo.create({
            url: `${baseRoomUrl}/${folder}/${file}`,
            description: `${roomTypeName} image`,
            isMain: file.includes('1'),
          })
        )
      );

      // Gắn ảnh vào tất cả RoomType
      for (const rt of roomTypes) {
        const attachments = savedImages.map((img) =>
          attachmentRepo.create({
            image: img,
            targetType: 'room',
            targetId: rt.id,
          })
        );

        await attachmentRepo.save(attachments);
      }

      console.log(
        `🛏️ Seeded ${savedImages.length} ảnh cho RoomType '${roomTypeName}' (${roomTypes.length} roomTypes)`
      );
    }

    console.log("🎉 Seed HOTEL + ROOMTYPE images hoàn tất!");
  }
}
