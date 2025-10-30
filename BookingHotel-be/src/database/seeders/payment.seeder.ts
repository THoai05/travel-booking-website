import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Payment, PaymentMethod, PaymentStatus, RefundStatus } from '../../managements/payments/entities/payments.entity';
import { Booking } from '../../managements/bookings/entities/bookings.entity';

export default class PaymentSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const paymentRepository = dataSource.getRepository(Payment);
    const bookingRepository = dataSource.getRepository(Booking);

    // Lấy toàn bộ booking (100 record như bạn nói)
    const bookings = await bookingRepository.find();
    if (bookings.length === 0) {
      console.log('⚠️ Không có booking để seed payment');
      return;
    }

    const payments: Payment[] = [];

    const methods = [
      PaymentMethod.COD,
      PaymentMethod.MOMO,
      PaymentMethod.VNPAY,
    ];

    const statuses = [
      PaymentStatus.SUCCESS,
      PaymentStatus.PENDING,
      PaymentStatus.FAILED,
    ];

    const refundStatuses = [
      RefundStatus.NONE,
      RefundStatus.REFUNDED,
      RefundStatus.REJECTED,
    ];

    for (const booking of bookings) {
      const method = methods[Math.floor(Math.random() * methods.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const refund = refundStatuses[Math.floor(Math.random() * refundStatuses.length)];

      const payment = paymentRepository.create({
        booking: booking,
        amount: booking.totalPrice,
        currency: 'vnd',
        paymentMethod: method,
        paymentStatus: status,
        transactionId: `TXN-${booking.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        refundStatus: refund,
        paidAt: status === PaymentStatus.SUCCESS ? new Date() : null,
      });

      payments.push(payment);
    }

    await paymentRepository.save(payments);
    console.log(`🌱 Seeded ${payments.length} payments successfully`);
  }
}
