import { Controller, Post, Body, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordResetsService } from './password-resets.service';
import { SmsService } from './sms.service';
import { MailService } from './mail.service';
import { User } from '../users/user.entity';

@Controller('password-resets')
export class PasswordResetsController {
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

	  if (method === 'phone') user = await this.usersService.findByPhone(value);
	  else user = await this.usersService.findByEmail(value);

	  if (!user) throw new NotFoundException('Không tìm thấy tài khoản');

	  const token = await this.passwordResetsService.createResetToken(user);

	  if (method === 'email_link') {
		// token dùng để đi thẳng đến reset-password
		return { message: 'Link đã được tạo', token };
	  }

	  if (method === 'email_code') {
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		await this.mailService.sendResetCode(user.email, code);
		return { message: 'OTP đã được gửi', code };
	  }

	  if (method === 'phone') {
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		await this.smsService.sendResetCode(user.phone!, code);
		return { message: 'OTP đã được gửi qua SMS', code };
	  }
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
