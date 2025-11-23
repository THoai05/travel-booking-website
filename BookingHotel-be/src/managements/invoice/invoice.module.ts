// invoice.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Booking } from '../bookings/entities/bookings.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';
import { RatePlan } from 'src/managements/rooms/entities/ratePlans.entity';
import { Payment } from 'src/managements/payments/entities/payments.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking, User, RoomType, RatePlan, Payment]),
        MailerModule.forRoot({
            transport: {
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            defaults: {
                from: '"Travel Booking" <your_email@gmail.com>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: { strict: true },
            },
        }),
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService],
})
export class InvoiceModule { }
