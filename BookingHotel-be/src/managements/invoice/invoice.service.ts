// invoice.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import { Booking } from '../bookings/entities/bookings.entity';
import { Payment } from 'src/managements/payments/entities/payments.entity';

@Injectable()
export class InvoiceService {
    constructor(
        private readonly mailerService: MailerService,
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
        @InjectRepository(Payment)
        private readonly paymentRepo?: Repository<Payment>, // optional
    ) { }

    // Lấy booking từ DB rồi map thành object dùng cho template/pdf
    async getBookingById(id: number) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['user', 'roomType', 'rateplan', 'payment'],
        });

        if (!booking) return null;

        // Map dữ liệu từ entity sang format template cần
        const customerName = booking.contactFullName ?? booking.user?.fullName ?? 'Khách hàng';
        const hotelName = booking.roomType?.hotel ?? booking.roomType?.name ?? 'Khách sạn';
        const totalPrice = Number(booking.totalPrice ?? 0);
        const date = booking.createdAt ? booking.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        const status = booking.status ?? 'pending';
        const code = `HD${booking.id}`; // tuỳ bạn muốn format code như nào

        // Nếu cần lấy thông tin payment chi tiết
        const paymentInfo = booking.payment ?? null;

        return {
            id: booking.id,
            code,
            customerName,
            hotelName,
            price: totalPrice,
            date,
            status,
            checkInDate: booking.checkInDate ? booking.checkInDate.toISOString().slice(0, 10) : null,
            checkOutDate: booking.checkOutDate ? booking.checkOutDate.toISOString().slice(0, 10) : null,
            guestsCount: booking.guestsCount,
            contactEmail: booking.contactEmail,
            contactPhone: booking.contactPhone,
            guestFullName: booking.guestFullName,
            specialRequests: booking.specialRequests,
            cancellationReason: booking.cancellationReason,
            payment: paymentInfo,
        };
    }

    async sendInvoiceEmail(to: string, bookingData: any, pdfPath: string) {
        await this.mailerService.sendMail({
            to,
            subject: `Hóa đơn đặt phòng #${bookingData.code}`,
            template: './invoice-template',
            context: {
                code: bookingData.code,
                name: bookingData.customerName,
                hotel: bookingData.hotelName,
                price: bookingData.price.toLocaleString('vi-VN') + '₫',
                date: bookingData.date,
                status: bookingData.status,
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                guestsCount: bookingData.guestsCount,
            },
            attachments: [
                {
                    filename: `invoice-${bookingData.code}.pdf`,
                    path: pdfPath,
                },
            ],
        });

        return { message: 'Invoice sent successfully!' };
    }

    async generateInvoicePDF(bookingData) {
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const templatePath = path.join(__dirname, 'templates', 'invoice-template.hbs');
        const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(htmlTemplate);
        const html = template(bookingData);

        const fontPath = fs.existsSync(path.join(__dirname, 'assets/fonts/Roboto-Regular.ttf'))
            ? path.join(__dirname, 'assets/fonts/Roboto-Regular.ttf')
            : path.resolve(process.cwd(), 'src/assets/fonts/Roboto-Regular.ttf');
        const fontData = fs.readFileSync(fontPath).toString('base64');
        const htmlWithFont = `
      <style>
        @font-face {
          font-family: 'Roboto';
          src: url(data:font/truetype;charset=utf-8;base64,${fontData}) format('truetype');
        }
        body { font-family: 'Roboto', sans-serif; }
      </style>
      ${html}
    `;

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlWithFont, { waitUntil: 'networkidle0' });

        const pdfPath = path.join(tempDir, `invoice-${bookingData.code}.pdf`);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
        });

        await browser.close();
        return pdfPath;
    }
}
