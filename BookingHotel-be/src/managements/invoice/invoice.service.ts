import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';

@Injectable()
export class InvoiceService {
    constructor(private readonly mailerService: MailerService) { }

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

        // Font base64
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

        const browser = await puppeteer.launch();
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
