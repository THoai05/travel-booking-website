import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto): Promise<any> {
    const { username, email, password, full_name } = body;

    if (!username || !email || !password || !full_name) {
      throw new BadRequestException('Missing required fields');
    }

    const existingUser =
      (await this.usersService.findByUsername(username)) ||
      (await this.usersService.findByEmail(email));

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const newUser = await this.usersService.create(body);
    const { password: _, ...result } = newUser; // loại bỏ password trước khi trả về
    return result;
  }
}
