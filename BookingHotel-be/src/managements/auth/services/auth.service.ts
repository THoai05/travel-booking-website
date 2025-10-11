import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, MembershipLevel } from '../../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(data: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
  }) {
    const { username, email, password, fullName, phone } = data;

    const existUser = await this.userRepo.findOne({
      where: [{ username }, { email }],
    });
    if (existUser) throw new BadRequestException('Username hoặc Email đã tồn tại!');

    const hashed = await bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({
      username,
      password: hashed,
      fullName,
      email,
      phone,
      role: UserRole.CUSTOMER,
      membershipLevel: MembershipLevel.SILVER,
    });

    await this.userRepo.save(newUser);
    return { message: 'Đăng ký thành công', userId: newUser.id };
  }

	async login(data: { usernameOrEmail: string; password: string }) {
	  const { usernameOrEmail, password } = data;

	  const user = await this.userRepo.findOne({
		where: [
		  { username: usernameOrEmail },
		  { email: usernameOrEmail }
		]
	  });

	  if (!user) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu!');

	  const valid = await bcrypt.compare(password, user.password);
	  if (!valid) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu!');

	  // Xoá mật khẩu trước khi trả về
	  const { password: _, ...userWithoutPassword } = user;

	  return {
		message: 'Đăng nhập thành công',
		user: userWithoutPassword
	  };
	}

}
