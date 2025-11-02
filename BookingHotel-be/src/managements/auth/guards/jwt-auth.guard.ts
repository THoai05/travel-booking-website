import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

 async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
  const token = request.cookies?.access_Token;
  if (!token) throw new UnauthorizedException('Missing token');

  try {
    const payload = await this.jwtService.verifyAsync(token);
    request.user = payload;
    return true;
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
}
}