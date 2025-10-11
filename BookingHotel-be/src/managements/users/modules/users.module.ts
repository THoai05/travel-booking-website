import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { User } from '../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ✅ Đăng ký entity User
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService], // ✅ Cho phép module khác dùng lại
})
export class UsersModule {}
