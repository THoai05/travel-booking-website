import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { join } from 'path';
import { env } from 'process';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS, // tạo app password trong Gmail
                },
            },
            defaults: {
                from: '"Travel Booking" <your_email@gmail.com>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService],
})
export class InvoiceModule { }
