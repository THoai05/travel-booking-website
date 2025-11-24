import { Injectable, BadRequestException } from '@nestjs/common';
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
        private readonly paymentRepo?: Repository<Payment>,
    ) { }

    // Lấy booking từ DB rồi map dữ liệu cho template
    async getBookingById(id: number) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['user', 'roomType', 'rateplan', 'payment'],
        });

        if (!booking) return null;

        // Lấy tên khách
        const customerName = booking.contactFullName ?? booking.user?.fullName ?? 'Khách hàng';

        // Lấy tên khách sạn
        const hotelName = booking.roomType?.hotel ?? booking.roomType?.name ?? 'Khách sạn';

        // Lấy tổng tiền
        const totalPrice = Number(booking.totalPrice ?? 0);

        // Lấy ngày tạo booking
        const date = booking.createdAt
            ? new Date(booking.createdAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10);

        // Trạng thái
        const status = booking.status ?? 'completed';

        // Code hoá đơn
        const code = `HD${booking.id}`;

        // Payment info
        const paymentInfo = booking.payment ?? null;

        // CheckIn / CheckOut date fix kiểu
        const checkInDate = booking.checkInDate ? new Date(booking.checkInDate).toISOString().slice(0, 10) : null;
        const checkOutDate = booking.checkOutDate ? new Date(booking.checkOutDate).toISOString().slice(0, 10) : null;

        return {
            id: booking.id,
            code,
            customerName,
            hotelName,
            price: totalPrice,
            date,
            status,
            checkInDate,
            checkOutDate,
            guestsCount: booking.guestsCount,
            contactEmail: booking.contactEmail ?? booking.user?.email, // map email luôn
            contactPhone: booking.contactPhone,
            guestFullName: booking.guestFullName,
            specialRequests: booking.specialRequests,
            cancellationReason: booking.cancellationReason,
            payment: paymentInfo,
        };
    }


    // Gửi invoice
    async sendInvoice(bookingId: number) {

        const booking = await this.getBookingById(bookingId);

        if (!booking) throw new BadRequestException('Booking not found');

        if (booking.status === 'cancelled') {
            throw new BadRequestException('Cannot send invoice for cancelled booking');
        }

        const email = booking.contactEmail;

        if (!email) throw new BadRequestException('Booking does not contain an email');

        const pdfPath = await this.generateInvoicePDF(booking);

        return this.sendInvoiceEmail(email, booking, pdfPath);
    }

    // Tạo PDF từ template Handlebars
    async generateInvoicePDF(bookingData) {
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

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
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

        await browser.close();
        return pdfPath;
    }

    // Gửi email
    async sendInvoiceEmail(to: string, bookingData, pdfPath: string) {
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

        return { message: 'Invoice sent successfully!', email: to };
    }
}