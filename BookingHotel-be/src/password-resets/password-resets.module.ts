import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './password-resets.entity';
import { PasswordResetsService } from './password-resets.service';
import { PasswordResetsController } from './password-resets.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset]), UsersModule],
  providers: [PasswordResetsService],
  controllers: [PasswordResetsController],
})
export class PasswordResetsModule {}
