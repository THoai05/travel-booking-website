import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: any) {
    return this.authService.register(data);
  }

  // ✅ Thêm login
  @Post('login')
  async login(@Body() body: { usernameOrEmail: string; password: string }) {
    const { usernameOrEmail, password } = body;
    return this.authService.login(usernameOrEmail, password);
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
