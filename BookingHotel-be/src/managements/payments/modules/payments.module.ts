import { Module } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { PaymentsController } from '../controllers/payments.controller';
import { PaymentGateController } from '../controllers/paymentGate.controller';
import { PaymentGateService } from '../services/paymentGate.service';
import { BookingsModule } from 'src/managements/bookings/modules/bookings.module';

@Module({
  imports:[BookingsModule],
  controllers: [PaymentsController,PaymentGateController],
  providers: [PaymentsService,PaymentGateService,],
})
export class PaymentsModule {}
