import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { Payment } from '../entities/payments.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Get()
  async getAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async getPayment(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.getByIdOrFail(Number(id));
  }
}
