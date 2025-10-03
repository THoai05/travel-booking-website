import { Controller, Post, Body, Param, NotFoundException , BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordResetsService } from './password-resets.service';
import { SmsService } from './sms.service';
import { MailService } from './mail.service';
import { User } from '../users/user.entity';

@Controller('password-resets')
export class PasswordResetsController {
  // tạm lưu OTP theo phone/email (ở đây dùng memory, thực tế nên DB/Redis)
  private otpStore = new Map<string, string>();

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordResetsService: PasswordResetsService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
  ) {}

  // Gửi yêu cầu reset
  @Post('request')
  async requestReset(@Body() body: { method: string; value: string }) {
    const { method, value } = body;
    let user: User | null = null;

    if (method === 'phone' || method === 'sms') user = await this.usersService.findByPhone(value);
    else user = await this.usersService.findByEmail(value);

    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');

    const token = await this.passwordResetsService.createResetToken(user);

    if (method === 'email_link') {
      return { message: 'Link đã được tạo', token };
    }

    if (method === 'email_code') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await this.mailService.sendResetCode(user.email, code);
      this.otpStore.set(user.email, code);
      return { message: 'OTP đã được gửi qua email' };
    }

	if (method === 'phone' || method === 'sms') {
	  const code = Math.floor(100000 + Math.random() * 900000).toString();

	  let normalizedPhone = user.phone!;
	  if (!normalizedPhone) throw new BadRequestException('Số điện thoại không tồn tại');

	  if (/^0\d{9,10}$/.test(normalizedPhone)) {
		normalizedPhone = '+84' + normalizedPhone.slice(1);
	  }

	  try {
		await this.smsService.sendOtp(normalizedPhone, code);
		this.otpStore.set(normalizedPhone, code);
		return { message: 'OTP đã được gửi qua SMS' };
	  } catch (err) {
		console.error(err);
		throw new InternalServerErrorException('Không thể gửi OTP. Kiểm tra số điện thoại hoặc cấu hình Twilio');
	  }
	}


  }

  // Xác minh OTP SMS/email
  @Post('verify')
  async verifyOtp(@Body() body: { method: string; value: string; code: string }) {
    const { method, value, code } = body;
    const savedCode = this.otpStore.get(value);

    if (!savedCode || savedCode !== code) {
      return { ok: false, message: 'OTP không hợp lệ hoặc đã hết hạn' };
    }

    this.otpStore.delete(value); // xoá OTP đã dùng

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
