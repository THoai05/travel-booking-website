import { Controller, Post, Body, Param, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordResetsService } from './password-resets.service';
import { SmsService } from './sms.service';
import { MailService } from './mail.service';
import { User } from '../users/user.entity';

interface OtpEntry {
  code: string;
  expiresAt: number;
}

@Controller('password-resets')
export class PasswordResetsController {
  // Map lưu OTP tạm, key = normalized phone/email
  private otpStore = new Map<string, OtpEntry>();
  private OTP_EXPIRE_MS = 5 * 60 * 1000; // 5 phút

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordResetsService: PasswordResetsService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
  ) {}

  // Gửi OTP / reset request
  @Post('request')
  async requestReset(@Body() body: { method: string; value: string }) {
    const { method, value } = body;
    let user: User | null = null;

    // 1️⃣ Tìm user theo method
    if (method === 'phone' || method === 'sms') user = await this.usersService.findByPhone(value);
    else user = await this.usersService.findByEmail(value);

    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');

    const token = await this.passwordResetsService.createResetToken(user);

    // 2️⃣ Email link
    if (method === 'email_link') {
      return { message: 'Link đã được tạo', token };
    }

    // 3️⃣ Email code
    if (method === 'email_code') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await this.mailService.sendResetCode(user.email, code);
      this.otpStore.set(user.email, { code, expiresAt: Date.now() + this.OTP_EXPIRE_MS });
      return { message: 'OTP đã được gửi qua email' };
    }

    // 4️⃣ SMS / phone
    if (method === 'phone' || method === 'sms') {
      if (!user.phone) throw new BadRequestException('Số điện thoại không tồn tại');

      let normalizedPhone = user.phone;
      if (/^0\d{9,10}$/.test(normalizedPhone)) {
        normalizedPhone = '+84' + normalizedPhone.slice(1);
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      try {
        // MOCK SMS: log ra console (test dev)
        console.log(`Mock OTP for ${normalizedPhone}: ${code}`);

        // Thực tế: uncomment khi có SMS provider
        // await this.smsService.sendOtp(normalizedPhone, code);

        this.otpStore.set(normalizedPhone, { code, expiresAt: Date.now() + this.OTP_EXPIRE_MS });
        return { message: 'OTP đã được gửi qua SMS (mock)', code };
      } catch (err) {
        console.error(err);
        throw new InternalServerErrorException('Không thể gửi OTP. Kiểm tra số điện thoại hoặc cấu hình SMS provider');
      }
    }

    throw new BadRequestException('Phương thức không hợp lệ');
  }

  // Xác minh OTP
  @Post('verify')
  async verifyOtp(@Body() body: { method: string; value: string; code: string }) {
    const { method, value, code } = body;

    let key = value;
    if (method === 'phone' || method === 'sms') {
      if (/^0\d{9,10}$/.test(value)) key = '+84' + value.slice(1);
    }

    const saved = this.otpStore.get(key);
    if (!saved || saved.code !== code || saved.expiresAt < Date.now()) {
      return { ok: false, message: 'OTP không hợp lệ hoặc đã hết hạn' };
    }

    this.otpStore.delete(key);

    const user =
      method === 'phone' || method === 'sms'
        ? await this.usersService.findByPhone(value)
        : await this.usersService.findByEmail(value);

    const token = await this.passwordResetsService.createResetToken(user!);

    return { ok: true, token };
  }

  // Đặt lại mật khẩu
  @Post('reset/:token')
  async resetPassword(@Param('token') token: string, @Body('password') password: string) {
    const user = await this.passwordResetsService.validateToken(token);
    await this.usersService.updatePassword(user.id, password);
    await this.passwordResetsService.deleteToken(token);
    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
