import { Seeder } from 'typeorm-extension';
import { DataSource, Not } from 'typeorm';
import {
  Booking,
  BookingStatus,
} from '../../managements/bookings/entities/bookings.entity';
import { User } from '../../managements/users/entities/users.entity';
import { RatePlan } from '../../managements/rooms/entities/ratePlans.entity';

export default class BookingSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const bookingRepository = dataSource.getRepository(Booking);
    const userRepository = dataSource.getRepository(User);
    const ratePlanRepository = dataSource.getRepository(RatePlan);

    const users = await userRepository.find({ where: { id: Not(1) } });
    const ratePlans = await ratePlanRepository.find({
      relations: ['roomType'],
    });

    if (users.length === 0 || ratePlans.length === 0) {
      console.log('⚠️ Không có user hoặc rate plan để seed booking');
      return;
    }

    const bookings: Booking[] = [];

    for (const user of users) {
      for (let i = 0; i < 5; i++) {
        const randomRatePlan =
          ratePlans[Math.floor(Math.random() * ratePlans.length)];
        const roomType = randomRatePlan.roomType;

        // ✅ Random ngày trong 12 tháng qua
        const createdAt = this.randomDateInLastYear();

        // ✅ Cho check-in và check-out gần createdAt (vd: vài ngày sau)
        const checkIn = new Date(createdAt);
        checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 10));
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 5) + 1);

        const nights = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        );

        const pricePerNight = Number(randomRatePlan.sale_price ?? 1000000);
        const totalPrice = pricePerNight * nights;

        const statuses = [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.CANCELLED,
          BookingStatus.COMPLETED,
        ];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const booking = bookingRepository.create({
          user,
          roomType,
          rateplan: randomRatePlan,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestsCount: Math.floor(Math.random() * roomType.max_guests) + 1,
          status,
          totalPrice,
          contactFullName: user.fullName,
          contactEmail: user.email,
          contactPhone: '090' + Math.floor(1000000 + Math.random() * 8999999),
          guestFullName: Math.random() > 0.5 ? user.fullName : 'Nguyễn Văn A',
          specialRequests:
            Math.random() > 0.7 ? 'Yêu cầu thêm nước suối' : undefined,
          cancellationReason:
            status === BookingStatus.CANCELLED
              ? 'Khách hủy vì đổi kế hoạch'
              : undefined,
          createdAt, // ✅ gán ngày tạo ngẫu nhiên
        });

        bookings.push(booking);
      }
    }

    await bookingRepository.save(bookings);
    console.log(`🌱 Seeded ${bookings.length} bookings successfully`);
  }

  /**
   * Random 1 ngày trong 12 tháng qua
   */
  private randomDateInLastYear(): Date {
    const now = new Date();
    const pastYear = new Date();
    pastYear.setFullYear(now.getFullYear() - 1);
    const randomTime =
      pastYear.getTime() +
      Math.random() * (now.getTime() - pastYear.getTime());
    return new Date(randomTime);
  }
}
