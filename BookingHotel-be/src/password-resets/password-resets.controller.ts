import { Controller, Post, Body, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordResetsService } from './password-resets.service';

@Controller('password-resets')
export class PasswordResetsController {
  constructor(
    private usersService: UsersService,
    private resetService: PasswordResetsService,
  ) {}

  @Post('request')
  async requestReset(@Body('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'Không tìm thấy email trong hệ thống' };
    }

    const token = await this.resetService.createResetToken(user);

    // Ở đây bạn gửi email chứa link reset:
    // http://localhost:3000/reset-password/{token}
    // Dùng nodemailer hoặc service mail khác
    return { message: 'Link đặt lại mật khẩu đã gửi qua email', token };
  }

  @Post('reset/:token')
  async resetPassword(@Param('token') token: string, @Body('password') password: string) {
    const user = await this.resetService.validateToken(token);
    await this.usersService.updatePassword(user.id, password);
    await this.resetService.deleteToken(token);

    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
