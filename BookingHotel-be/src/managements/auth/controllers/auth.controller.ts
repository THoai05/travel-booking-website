import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  // POST /auth/register
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  // POST /auth/login
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }
}
