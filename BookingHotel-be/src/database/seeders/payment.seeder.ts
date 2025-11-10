import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from '../../managements/payments/entities/payments.entity';
import { Booking } from '../../managements/bookings/entities/bookings.entity';

export default class PaymentSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const paymentRepository = dataSource.getRepository(Payment);
    const bookingRepository = dataSource.getRepository(Booking);

    const bookings = await bookingRepository.find();
    if (bookings.length === 0) {
      console.log('⚠️ Không có booking để seed payment');
      return;
    }

    const payments: Payment[] = [];

    const methods = [PaymentMethod.COD, PaymentMethod.MOMO, PaymentMethod.VNPAY];
    const statuses = [PaymentStatus.SUCCESS, PaymentStatus.PENDING, PaymentStatus.FAILED];
    const refundStatuses = [RefundStatus.NONE, RefundStatus.REFUNDED, RefundStatus.REJECTED];

    for (const booking of bookings) {
      const method = this.randomItem(methods);
      const status = this.randomItem(statuses);
      const refund = this.randomItem(refundStatuses);

      // ✅ Nếu booking có createdAt thì dựa vào đó làm thời gian thanh toán
      const createdAt = booking.createdAt ?? this.randomDateInLastYear();

      // ✅ paidAt chỉ có nếu payment thành công, lệch 0–5 ngày sau createdAt
      const paidAt =
        status === PaymentStatus.SUCCESS
          ? this.randomDateNear(createdAt, 0, 5)
          : null;

      const payment = paymentRepository.create({
        booking,
        amount: booking.totalPrice,
        currency: 'vnd',
        paymentMethod: method,
        paymentStatus: status,
        transactionId: `TXN-${booking.id}-${Date.now()}-${Math.floor(
          Math.random() * 10000,
        )}`,
        refundStatus: refund,
        paidAt,
        createdAt, // ✅ rải đều 12 tháng
      });

      payments.push(payment);
    }

    await paymentRepository.save(payments);
    console.log(`🌱 Seeded ${payments.length} payments successfully`);
  }

  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
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

  /**
   * Random 1 ngày gần ngày gốc (offset ± min–max ngày)
   */
  private randomDateNear(baseDate: Date, minOffset: number, maxOffset: number): Date {
    const offsetDays = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
    const result = new Date(baseDate);
    result.setDate(result.getDate() + offsetDays);
    return result;
  }
}
