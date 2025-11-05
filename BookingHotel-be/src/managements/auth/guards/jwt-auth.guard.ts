import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_Token;

    // 🔹 Log debug token
    console.log('JwtAuthGuard token:', token);

    if (!token) {
      console.warn('❌ Missing token in request cookies');
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      // 🔹 Log payload
      console.log('JwtAuthGuard payload:', payload);

      // Gán payload vào request.user để FE/BE sử dụng
      request.user = payload;

      return true;
    } catch (err) {
      console.error('❌ Token invalid or expired:', err.message || err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
