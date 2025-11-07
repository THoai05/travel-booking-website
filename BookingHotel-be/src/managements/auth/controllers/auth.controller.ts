import { Controller, Post, Body, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Response } from 'express';
import { LoginRequestDto } from '../dtos/req/LoginRequestDto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() data: any) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { usernameOrEmail, password } = body;
    const { message, token, userWithoutPassword } = await this.authService.login(body);
    res.cookie('access_Token', token, {
      httpOnly: true,
      secure: false, // nếu HTTPS thì true
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15, // 15 phút
      signed: false,
    });

    return {
      message,
      userWithoutPassword,
    };
  }

  @Get('logout')
  async logOut(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_Token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(0), // xóa cookie
    });
    return { message: 'success' };
  }

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@Req() req) {
	  // Lấy id từ token
    const userId = req.user?.sub; 
    
    console.log(userId)

	  // Gọi hàm getProfile trong service để đọc thông tin đầy đủ từ DB
	  return this.authService.getProfile(userId);
	}
}
