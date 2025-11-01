import { Controller, Post, Body, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() data: any) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(
    @Body() body: { usernameOrEmail: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { usernameOrEmail, password } = body;
    const { message, token, userWithoutPassword } = await this.authService.login(usernameOrEmail, password);
    res.cookie('access_Token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
      signed: false
    })
    return {
      message,
      userWithoutPassword
    }
  }

  @Get('logout')
  async logOut(@Res({passthrough:true}) res: any) {
    res.cookie('access_Token', { expires: new Date(Date.now()) })
    return {
      message:"success"
    }
  }

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Req() req) {
	  // Lấy id từ token
	  const userId = req.user.sub; // vì khi sign token, bạn dùng payload: { sub: user.id, username, role }
	  
	  // Gọi hàm getProfile trong service để đọc thông tin đầy đủ từ DB
	  return this.authService.getProfile(userId);
	}
}
