import { Controller, Post, Body, ParseIntPipe, Param } from '@nestjs/common';
import { ResetPasswordService } from '../services/reset_password.service';
import { User } from 'src/managements/users/entities/users.entity';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetService: ResetPasswordService) { }

  // Tạo token cho link reset
  @Post('send-link')
  async sendLink(@Body('email') email: string) {
    const user: User = await this.resetService.findUserByEmail(email);
    return this.resetService.sendResetLink(user);
  }

  // Tạo OTP
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    const user: User = await this.resetService.findUserByEmail(email);
    return this.resetService.sendOTP(user);
  }

  // Xác thực OTP
  @Post('verify-otp')
  verifyOtp(@Body() body: { email: string; code: string }) {
    this.resetService.verifyOtp(body.email, body.code);
    return { ok: true };
  }

  // Reset password
  @Post('reset')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.resetService.resetPassword(body.token, body.newPassword);
  }

  // Kiểm tra token hợp lệ
  @Post('check-token')
  async checkToken(@Body('token') token: string) {
    try {
      const user = await this.resetService.validateToken(token);
      return { valid: true, email: user.email };
    } catch (err) {
      return { valid: false, message: 'Token không hợp lệ hoặc đã hết hạn' };
    }
  }

  // 📌 API tạo token reset password theo user id
  @Post('reset-password')
  async createResetToken(@Body() body: { userId: number; expireMinutes?: number }) {
    const token = await this.resetService.createResetTokenByUserId(
      body.userId,
      body.expireMinutes,
    );

    return {
      message: 'Reset token created successfully',
      token,
    };
  }

  // Reset password
  @Post('delete-token')
  async deleteToken(@Body() body: { token: string }) {
    return this.resetService.deleteToken(body.token);
  }
}
