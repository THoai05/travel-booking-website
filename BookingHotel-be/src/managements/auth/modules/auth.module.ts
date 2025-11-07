import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UsersModule } from '../../users/modules/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from '../strategies/google.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      global:true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn:"12h" },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy,GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
