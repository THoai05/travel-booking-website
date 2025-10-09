import { Module } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { PaymentsController } from '../controllers/payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
