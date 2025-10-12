import { Seeder } from 'typeorm-extension';
import { DataSource, Not } from 'typeorm';
import {
  Booking,
  BookingStatus,
} from '../../managements/bookings/entities/bookings.entity';
import { User } from '../../managements/users/entities/users.entity';
import { Room } from '../../managements/rooms/entities/rooms.entity';

export default class BookingSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const bookingRepository = dataSource.getRepository(Booking);
    const userRepository = dataSource.getRepository(User);
    const roomRepository = dataSource.getRepository(Room);

    // Lấy toàn bộ user (trừ admin id=1)
    const users = await userRepository.find({ where: { id: Not(1) } });

    // Lấy toàn bộ room
    const rooms = await roomRepository.find();

    if (users.length === 0 || rooms.length === 0) {
      console.log('⚠️ Không có user hoặc room để seed booking');
      return;
    }

    const bookings: Booking[] = [];

    for (const user of users) {
      for (let i = 0; i < 5; i++) {
        // 5 booking mỗi user
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];

        // random ngày check-in & check-out
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 30)); // trong vòng 30 ngày tới
        const checkOut = new Date(checkIn);
        checkOut.setDate(
          checkOut.getDate() + Math.floor(Math.random() * 5) + 1,
        ); // 1-5 đêm

        const nights = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        );
        const totalPrice = Number(randomRoom.pricePerNight) * nights;

        const statuses = [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.CANCELLED,
          BookingStatus.COMPLETED,
        ];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const booking = bookingRepository.create({
          // --- FIX START ---
          user: user,
          room: randomRoom,
          // --- FIX END ---
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestsCount: Math.floor(Math.random() * randomRoom.maxGuests) + 1,
          status,
          totalPrice,
          specialRequests:
            Math.random() > 0.7 ? 'Yêu cầu thêm nước suối' : undefined, // Using undefined is slightly cleaner than null for optional properties
          cancellationReason:
            status === BookingStatus.CANCELLED
              ? 'Khách hủy vì đổi kế hoạch'
              : undefined,
        });

        bookings.push(booking);
      }
    }

    await bookingRepository.save(bookings);
    console.log(`🌱 Seeded ${bookings.length} booking successfully`);
  }
}