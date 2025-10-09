import { 
  Controller, 
  Post, 
  Body, 
  BadRequestException, 
  Patch, 
  Param, 
  ParseIntPipe,
	Get   
} from '@nestjs/common';

import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  
	// ✨ Cập nhật thông tin user
	  @Patch(':id')
	  async updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() body: UpdateUserDto,
	  ) {
		if (!Object.keys(body).length) {
		  throw new BadRequestException('No data provided to update');
		}

		// Ép dob sang Date nếu có
		const updateData: any = { ...body };
		if (body.dob) {
		  updateData.dob = new Date(body.dob);
		}

		const updatedUser = await this.usersService.updateUser(id, updateData);
		const { password, ...result } = updatedUser;
		return {
		  message: 'Cập nhật thông tin thành công',
		  user: result,
		};
	  }
	
	 // ✨ API lấy thông tin user theo id
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { password, ...result } = user; // loại bỏ password
    return result;
  }

}
