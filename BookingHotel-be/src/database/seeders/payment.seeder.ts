import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from '../../managements/payments/entities/payments.entity';
import { Booking } from '../../managements/bookings/entities/bookings.entity';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
      const method = methods[Math.floor(Math.random() * methods.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const refund = refundStatuses[Math.floor(Math.random() * refundStatuses.length)];

      // Nếu booking có createdAt thì dùng nó (yêu cầu của bạn)
      const createdAt = booking.createdAt ?? new Date();

      // paidAt chỉ có nếu payment thành công, lệch 0–5 ngày sau createdAt
      const paidAt =
        status === PaymentStatus.SUCCESS
          ? (() => {
              const date = new Date(createdAt);
              date.setDate(date.getDate() + randomInt(0, 5));
              date.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));
              return date;
            })()
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
        createdAt, // gán createdAt = booking.createdAt
      });

      payments.push(payment);
    }

    await paymentRepository.save(payments);
    console.log(`🌱 Seeded ${payments.length} payments successfully`);
  }
}
