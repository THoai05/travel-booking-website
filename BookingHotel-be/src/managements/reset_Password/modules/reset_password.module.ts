import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPassword } from '../entities/reset_Password.entity';
import { ResetPasswordService } from '../services/reset_password.service';
import { ResetPasswordController } from '../controllers/reset_password.controller';
import { User } from 'src/managements/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPassword, User])],
  providers: [ResetPasswordService],
  controllers: [ResetPasswordController],
  exports: [TypeOrmModule, ResetPasswordService], // ✅ Cho phép module khác dùng lại
})
export class ResetPasswordModule { }
