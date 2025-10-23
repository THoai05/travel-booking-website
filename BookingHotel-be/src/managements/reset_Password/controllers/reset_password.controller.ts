import { Body, Controller, Post } from '@nestjs/common';
import { ResetPasswordService } from '../services/reset_password.service';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) { }

  // Gửi link reset
  @Post('send-link')
  async sendResetLink(@Body('email') email: string) {
    const user = await this.resetPasswordService.findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const token = await this.resetPasswordService.createResetToken(user.id);
    const link = `http://localhost:3000/reset-password?token=${token}`;
    await this.resetPasswordService.sendEmail(
      user.email,
      'Reset Password',
      `Click link to reset password: ${link}`,
    );

    return { message: 'Reset link sent' };
  }

  // Gửi OTP 6 số
  @Post('send-otp')
  async sendOTP(@Body('email') email: string) {
    const user = await this.resetPasswordService.findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const otp = await this.resetPasswordService.createOTP(user.id);
    await this.resetPasswordService.sendEmail(
      user.email,
      'OTP for Reset Password',
      `Your OTP code is: ${otp}`,
    );

    return { message: 'OTP sent' };
  }

  // Reset mật khẩu
  @Post('reset')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.resetPasswordService.resetPassword(token, newPassword);
    return { message: 'Password updated successfully' };
  }


}
