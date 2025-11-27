// invoice.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post('send')
    async sendInvoice(@Body('bookingId') bookingId: number, @Body('email') email: string) {
        if (!bookingId) throw new BadRequestException('bookingId is required');
        if (!email) throw new BadRequestException('email is required');

        const bookingData = await this.invoiceService.getBookingById(bookingId);
        if (!bookingData) throw new BadRequestException('Booking not found');

        const pdfPath = await this.invoiceService.generateInvoicePDF(bookingData);
        return await this.invoiceService.sendInvoiceEmail(email, bookingData, pdfPath);
    }
}
