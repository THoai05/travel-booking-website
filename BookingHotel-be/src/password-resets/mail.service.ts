import { Injectable } from '@nestjs/common';
import emailjs from '@emailjs/browser';

@Injectable()
export class MailService {
  async sendResetLink(email: string, token: string) {
    // Gửi email link bằng EmailJS (hoặc console.log nếu mock)
    console.log(`Gửi email link tới ${email}: http://localhost:3000/reset-password?token=${token}`);
    // Ví dụ EmailJS:
    // await emailjs.send(
    //   process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    //   process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    //   { to_email: email, message: `Link: http://localhost:3000/reset-password?token=${token}` },
    //   process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    // );
  }

  async sendResetCode(email: string, code: string) {
    console.log(`Gửi email OTP tới ${email}: mã OTP là ${code}`);
  }
}
