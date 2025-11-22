import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from '../services/payments.service';
import { PaymentsController } from '../controllers/payments.controller';
import { PaymentGateController } from '../controllers/paymentGate.controller';
import { PaymentGateService } from '../services/paymentGate.service';
import { BookingsModule } from 'src/managements/bookings/modules/bookings.module';
import { Payment } from '../entities/payments.entity';

@Module({
  imports: [
    BookingsModule,
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentsController, PaymentGateController],
  providers: [PaymentsService, PaymentGateService],
})
export class PaymentsModule {}
