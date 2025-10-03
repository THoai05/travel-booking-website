import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Twilio from 'twilio'; // <- sửa ở đây

@Injectable()
export class SmsService {
  private client: Twilio.Twilio;

  constructor() {
    this.client = Twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }

  async sendOtp(phone: string, code: string) {
    let normalizedPhone = phone;
    if (/^0\d{9,10}$/.test(phone)) {
      normalizedPhone = '+84' + phone.slice(1);
    }

    try {
      await this.client.messages.create({
        body: `Mã OTP của bạn là: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: normalizedPhone,
      });
    } catch (err) {
      console.error("Twilio Error:", err);
      throw new InternalServerErrorException(
        "Không thể gửi OTP. Kiểm tra số điện thoại hoặc cấu hình Twilio"
      );
    }
  }
}
