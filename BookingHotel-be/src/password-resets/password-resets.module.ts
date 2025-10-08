import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetsController } from './password-resets.controller';
import { PasswordResetsService } from './password-resets.service';
import { SmsService } from './sms.service';
import { MailService } from './mail.service';
import { UsersModule } from '../users/users.module'; // import module
import { PasswordReset } from './password-resets.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordReset]),
    UsersModule, // <- phải import UsersModule để inject UsersService
  ],
  controllers: [PasswordResetsController],
  providers: [PasswordResetsService, SmsService, MailService], // chỉ khai báo service của module này
})
export class PasswordResetsModule {}
