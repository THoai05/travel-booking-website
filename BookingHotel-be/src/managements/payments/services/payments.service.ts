import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payments.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,
    ) { }

    async findAll(): Promise<Payment[]> {
        return this.paymentRepo.find({
            relations: ['booking'],
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: number): Promise<Payment | null> {
        return this.paymentRepo.findOne({
            where: { id },
            relations: ['booking'],
        });
    }

    async getByIdOrFail(id: number): Promise<Payment> {
        const payment = await this.findById(id);
        if (!payment) {
            throw new NotFoundException(`Payment with id ${id} not found`);
        }
        return payment;
    }
}
