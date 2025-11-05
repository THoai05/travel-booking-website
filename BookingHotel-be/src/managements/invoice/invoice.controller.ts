import { Controller, Post, Body } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post('send')
    async sendInvoice(@Body('email') email: string) {
        const bookingData = {
            code: 'HD001',
            customerName: 'Nguyễn Văn Tiến',
            hotelName: 'Khách sạn Ánh Dương',
            price: 1200000,
            date: '2025-10-18',
            status: 'Đã thanh toán',
        };

        const pdfPath = await this.invoiceService.generateInvoicePDF(bookingData);
        return await this.invoiceService.sendInvoiceEmail(email, bookingData, pdfPath);
    }
}
