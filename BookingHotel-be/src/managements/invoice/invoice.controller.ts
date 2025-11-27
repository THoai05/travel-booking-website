import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post('send')
    async sendInvoice(@Body('bookingId') bookingId: number) {
        if (!bookingId) {
            throw new BadRequestException('bookingId is required');
        }
        return await this.invoiceService.sendInvoice(bookingId);
    }
}
