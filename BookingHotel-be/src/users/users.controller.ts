import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto): Promise<any> {
    const { username, email, password, full_name , phone } = body;

    if (!username || !email || !password || !full_name) {
      throw new BadRequestException('Missing required fields');
    }
	
	// Kiểm tra username/email/phone đã tồn tại
	// check username
	  const userByUsername = await this.usersService.findByUsername(username);
	  if (userByUsername) {
		throw new BadRequestException('Username already exists');
	  }

	  // check email
	  const userByEmail = await this.usersService.findByEmail(email);
	  if (userByEmail) {
		throw new BadRequestException('Email already exists');
	  }

	  // check phone (nếu có gửi lên)
	  if (phone) {
		const userByPhone = await this.usersService.findByPhone(phone);
		if (userByPhone) {
		  throw new BadRequestException('Phone number already exists');
		}
	  }
	  
	  // check phone hợp lệ nếu có
	  if (phone) {
		const vnPhoneRegex = /^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
		if (!vnPhoneRegex.test(phone)) {
		  throw new BadRequestException('Phone number is not valid in Vietnam');
		}
	  }

    const newUser = await this.usersService.create(body);
    const { password: _, ...result } = newUser; // loại bỏ password trước khi trả về
    return result;
  }
  
  // LOGIN
  @Post('login')
  async login(@Body() body: { usernameOrEmail: string; password: string }) {
    const { usernameOrEmail, password } = body;

    if (!usernameOrEmail || !password) {
      throw new BadRequestException('Username/email và password là bắt buộc');
    }

    const user = await this.usersService.validateUser(usernameOrEmail, password);
    if (!user) throw new BadRequestException('Thông tin đăng nhập không chính xác');

    return {
      message: 'Đăng nhập thành công',
      user,
    };
  }
}
