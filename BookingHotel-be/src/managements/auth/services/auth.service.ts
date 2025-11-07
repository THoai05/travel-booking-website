import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, Gender, MembershipLevel } from '../../users/entities/users.entity';
import { LoginRequestDto } from '../dtos/req/LoginRequestDto.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private jwtService: JwtService,
	) { }

	async register(data: {
		username: string;
		password: string;
		fullName: string;
		email: string;
		phone: string;
		dob?: string;
		gender: "male" | "female" | "other";
	}) {
		const { username, email, password, fullName, phone, dob, gender } = data;

		// Kiểm tra username trùng
		const existUsername = await this.userRepo.findOne({ where: { username } });
		if (existUsername) throw new BadRequestException('Username đã tồn tại!');

		// Kiểm tra email trùng
		const existEmail = await this.userRepo.findOne({ where: { email } });
		if (existEmail) throw new BadRequestException('Email đã tồn tại!');

		const hashed = await bcrypt.hash(password, 10);

		const newUser = this.userRepo.create({
			username,
			password: hashed,
			fullName,
			email,
			phone,
			gender: gender as Gender,
			role: UserRole.CUSTOMER,
			membershipLevel: MembershipLevel.SILVER,
			dob: dob ? new Date(dob) : undefined,
		});

		await this.userRepo.save(newUser);
		return { message: 'Đăng ký thành công', userId: newUser.id };
	}

	async login(query: LoginRequestDto) {
		const { usernameOrEmail, password } = query;
		const user = await this.userRepo.findOne({
			where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
		});

		if (!user) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

		const payload = { sub: user.id, username: user.username, role: user.role };
		const token = await this.jwtService.signAsync(payload);

		// Loại bỏ password
		const { password: _, ...userWithoutPassword } = user;

		return { message: 'success', token, userWithoutPassword };
	}

	async getProfile(userId: number) {
		const user = await this.userRepo.findOne({ where: { id: userId } });
		if (!user) throw new UnauthorizedException('Token không hợp lệ');

		const { password, ...safeUser } = user;
		return safeUser;
	}


	async loginGoogle(username:string) {
		const user = await this.userRepo.findOne({
			where: {
				username
			},
		});

		if (!user) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

		const payload = { sub: user.id, username: user.username, role: user.role };
		const token = await this.jwtService.signAsync(payload);

		// Loại bỏ password
		const { password: _, ...userWithoutPassword } = user;

		return { message: 'success', token, userWithoutPassword };
	}

}
