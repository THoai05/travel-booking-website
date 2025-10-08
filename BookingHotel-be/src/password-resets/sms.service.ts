// src/password-resets/sms.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
const { Vonage } = require('@vonage/server-sdk');

@Injectable()
export class SmsService {
  private vonage: any;
  private brand: string;

  constructor() {
    const key = 123;
    const secret =123;
    this.brand = process.env.VONAGE_BRAND || 'MyApp';

    if (!key || !secret) {
      throw new Error('Missing VONAGE_API_KEY or VONAGE_API_SECRET in env');
    }

    this.vonage = new Vonage({
      apiKey: key,
      apiSecret: secret,
    });
  }

  // phone: E.164 or local like +84...
  async sendOtp(phone: string, code: string) {
    // normalize to E.164 basic: if starts with 0 and length plausible -> convert to +84
    let to = phone;
    if (/^0\d{9,10}$/.test(phone)) {
      to = '+84' + phone.slice(1);
    }

    const text = `Mã OTP của bạn là: ${code}`;

    try {
      return await new Promise((resolve, reject) => {
        this.vonage.sms.send(
          {
            to,
            from: this.brand, // brand or a number
            text,
          },
          (err: any, responseData: any) => {
            if (err) {
              return reject(err);
            }
            // Vonage returns message-count and messages[] with status
            // Check messages[0]['status'] === "0" means success
            if (responseData && responseData.messages && responseData.messages[0]) {
              const m = responseData.messages[0];
              if (m['status'] && m['status'] !== '0') {
                // status not 0 => error
                return reject(new Error(`Vonage error: status=${m['status']} , err=${m['error-text'] || ''}`));
              }
            }
            resolve(responseData);
          },
        );
      });
    } catch (err) {
      console.error('Vonage Error:', err);
      throw new InternalServerErrorException('Không thể gửi OTP. Kiểm tra cấu hình Vonage hoặc phone');
    }
  }
}
