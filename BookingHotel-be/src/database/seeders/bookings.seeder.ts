import { Seeder } from 'typeorm-extension';
import { DataSource, Not } from 'typeorm';
import {
  Booking,
  BookingStatus,
} from '../../managements/bookings/entities/bookings.entity';
import { User } from '../../managements/users/entities/users.entity';
import { RatePlan } from '../../managements/rooms/entities/ratePlans.entity';

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

    const totalBookings = 100;
    const year = 2025;
    const bookingsCreatedAt: Date[] = [];

    // ========================
    // 📅 Xác định tháng hiện tại
    // ========================
    const currentMonth = new Date().getMonth() + 1;

    // ========================
    // 🧩 Sinh dữ liệu theo tháng hiện tại
    // ========================
    if (currentMonth === 1) {
      // 🟢 Nếu là tháng 1 → toàn bộ 100 booking trong tháng 1
      const dim = daysInMonth(year, 1);
      for (let i = 0; i < totalBookings; i++) {
        const day = randomInt(1, dim);
        bookingsCreatedAt.push(
          new Date(year, 0, day, randomInt(0, 23), randomInt(0, 59), randomInt(0, 59))
        );
      }
    } else if (currentMonth === 2) {
      // 🟢 Nếu là tháng 2 → tháng 1 có 26 booking, tháng 2 có 74 booking
      const dim1 = daysInMonth(year, 1);
      const dim2 = daysInMonth(year, 2);

      for (let i = 0; i < 26; i++) {
        const day = randomInt(1, dim1);
        bookingsCreatedAt.push(
          new Date(year, 0, day, randomInt(0, 23), randomInt(0, 59), randomInt(0, 59))
        );
      }

      for (let i = 0; i < 74; i++) {
        const day = randomInt(1, dim2);
        bookingsCreatedAt.push(
          new Date(year, 1, day, randomInt(0, 23), randomInt(0, 59), randomInt(0, 59))
        );
      }
    } else {
      // 🟢 Nếu là tháng >= 3
      // Các tháng nhỏ hơn tháng hiện tại (ví dụ tháng 1,2): mỗi tháng có 1 booking
      for (let month = 1; month < currentMonth; month++) {
        const dim = daysInMonth(year, month);
        const day = randomInt(1, dim);
        bookingsCreatedAt.push(
          new Date(year, month - 1, day, randomInt(0, 23), randomInt(0, 59), randomInt(0, 59))
        );
      }

      // Thêm 25 booking ngẫu nhiên trong các tháng nhỏ hơn tháng hiện tại
      for (let i = 0; i < 25; i++) {
        const month = randomInt(1, currentMonth - 1);
        const dim = daysInMonth(year, month);
        const day = randomInt(1, dim);
        bookingsCreatedAt.push(
          new Date(year, month - 1, day, randomInt(0, 23), randomInt(0, 59), randomInt(0, 59))
        );
      }

      // Còn lại booking rơi vào tháng hiện tại
      const remaining = totalBookings - bookingsCreatedAt.length;
      const dimCurr = daysInMonth(year, currentMonth);
      for (let i = 0; i < remaining; i++) {
        const day = randomInt(1, dimCurr);
        bookingsCreatedAt.push(
          new Date(
            year,
            currentMonth - 1,
            day,
            randomInt(0, 23),
            randomInt(0, 59),
            randomInt(0, 59)
          )
        );
      }
    }

    // 🔀 Trộn ngẫu nhiên toàn bộ danh sách
    shuffle(bookingsCreatedAt);

    const statuses = [
      BookingStatus.PENDING,
      BookingStatus.CONFIRMED,
      BookingStatus.CANCELLED,
      BookingStatus.COMPLETED,
      BookingStatus.EXPIRED,
    ];

    const bookings: Booking[] = [];

    for (let i = 0; i < totalBookings; i++) {
      const createdAt = bookingsCreatedAt[i];

      // updatedAt > createdAt (0–3 ngày sau)
      const updatedAt = new Date(createdAt);
      updatedAt.setDate(updatedAt.getDate() + randomInt(0, 3));
      updatedAt.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));

      // checkIn = createdAt + (1–7) ngày
      const checkIn = new Date(createdAt);
      checkIn.setDate(checkIn.getDate() + randomInt(1, 7));
      checkIn.setHours(14, 0, 0);

      // checkOut = checkIn + (1–5) ngày
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + randomInt(1, 5));
      checkOut.setHours(12, 0, 0);

      const user = users[Math.floor(Math.random() * users.length)];
      const ratePlan = ratePlans[Math.floor(Math.random() * ratePlans.length)];
      const roomType = ratePlan.roomType;

      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      const pricePerNight = Number(ratePlan.sale_price ?? 1000000);
      const totalPrice = pricePerNight * nights;
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const booking = bookingRepository.create({
        user,
        roomType,
        rateplan: ratePlan,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestsCount: Math.floor(Math.random() * (roomType.max_guests || 3)) + 1,
        status,
        totalPrice,
        contactFullName: user.fullName,
        contactEmail: user.email,
        contactPhone: '090' + Math.floor(1000000 + Math.random() * 8999999),
        guestFullName: Math.random() > 0.5 ? user.fullName : 'Nguyễn Văn A',
        specialRequests: Math.random() > 0.7 ? 'Yêu cầu thêm nước suối' : undefined,
        cancellationReason:
          status === BookingStatus.CANCELLED ? 'Khách hủy vì đổi kế hoạch' : undefined,
        createdAt,
        updatedAt,
      });

      bookings.push(booking);
    }

    await bookingRepository.save(bookings);
    console.log(`🌱 Seeded ${bookings.length} bookings successfully for month ${currentMonth}`);
  }
}
