import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendResetCode(phone: string, code: string) {
    // TODO: tích hợp Twilio hoặc API SMS khác
    console.log(`Gửi SMS tới ${phone}: mã OTP là ${code}`);
  }
}
