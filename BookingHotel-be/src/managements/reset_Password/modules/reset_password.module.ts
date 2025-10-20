import { Module } from '@nestjs/common';
import { ResetPasswordService } from '../services/reset_password.service';
import { ResetPasswordController } from '../controllers/reset_password.controller';

@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
})
export class ResetPasswordModule {}
