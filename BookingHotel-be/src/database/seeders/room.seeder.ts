import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Room, RoomType, RoomStatus } from '../../managements/rooms/entities/rooms.entity';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';

export default class RoomSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roomRepository = dataSource.getRepository(Room);
    const hotelRepository = dataSource.getRepository(Hotel);

    const hotels = await hotelRepository.find();
    if (hotels.length === 0) {
      console.log('❌ Không có hotel nào trong DB — seed room thất bại');
      return;
    }

    const roomTypes = [RoomType.SINGLE, RoomType.DOUBLE, RoomType.SUITE, RoomType.DELUXE];
    const roomStatuses = [RoomStatus.AVAILABLE, RoomStatus.BOOKED, RoomStatus.MAINTENANCE];

    const rooms: Room[] = [];

    for (let i = 1; i <= 150; i++) {
      const hotel = hotels[Math.floor(Math.random() * hotels.length)];
      const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const status = roomStatuses[Math.floor(Math.random() * roomStatuses.length)];
      const floor = Math.floor(Math.random() * 10) + 1; // Tầng 1-10
      const roomNumber = `${floor}${i.toString().padStart(3, '0')}`;

      // Tạo giá random theo loại phòng
      let price = 500000;
      if (type === RoomType.DOUBLE) price = 800000;
      if (type === RoomType.SUITE) price = 1200000;
      if (type === RoomType.DELUXE) price = 1800000;

      const maxGuests =
        type === RoomType.SINGLE ? 1 :
        type === RoomType.DOUBLE ? 2 :
        type === RoomType.SUITE ? 3 : 4;

      rooms.push(
        roomRepository.create({
          hotel_id: hotel.id,
          roomNumber,
          roomType: type,
          pricePerNight: price,
          maxGuests,
          status,
          description: `Phòng ${type} số ${roomNumber} tại khách sạn ${hotel.name}`,
          floorNumber: floor,
          cancellationPolicy: 'Hủy phòng miễn phí trong vòng 24h.',
        }),
      );
    }

    await roomRepository.save(rooms);
    console.log(`🌱 Seeded ${rooms.length} rooms thành công`);
  }
}
