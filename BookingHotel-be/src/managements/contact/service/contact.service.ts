import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) { }

    async sendAndSave(contactData: { name: string; email: string; message: string }) {
        // 1️⃣ Gửi email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: contactData.email,
            to: 'bluvera05@gmail.com',
            subject: `Liên hệ từ ${contactData.name}`,
            text: contactData.message,
        };

        try {
            await transporter.sendMail(mailOptions);

            // 2️⃣ Lưu vào database nếu gửi email thành công
            const contact = this.contactRepository.create({
                ...contactData,
                created_at: new Date(),
            });
            await this.contactRepository.save(contact);

            return { message: 'Gửi liên hệ thành công!' };
        } catch (err) {
            console.error(err);
            throw new Error('Không thể gửi email, vui lòng thử lại sau');
        }
    }
}
