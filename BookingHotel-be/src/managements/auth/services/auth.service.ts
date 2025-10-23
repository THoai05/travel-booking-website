import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, Gender, MembershipLevel } from '../../users/entities/users.entity';

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
		dob?: string; // (ISO string, ví dụ: "2000-05-12")
		gender: "male" | "female" | "other";
	}) {
		const { username, email, password, fullName, phone, dob, gender } = data;

		// 🔍 Kiểm tra username hoặc email trùng
		const existUser = await this.userRepo.findOne({
			where: [{ username }, { email }],
		});
		if (existUser) throw new BadRequestException('Username hoặc Email đã tồn tại!');

		// 🔒 Hash password
		const hashed = await bcrypt.hash(password, 10);

		// 🧩 Tạo user mới
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

	async login(usernameOrEmail: string, password: string) {
		const user = await this.userRepo.findOne({
			where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
		});

		if (!user) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

		const payload = { sub: user.id, username: user.username, role: user.role };
		const token = await this.jwtService.signAsync(payload);

		return { message: 'Đăng nhập thành công', token };
	}

	async getProfile(userId: number) {
		const user = await this.userRepo.findOne({ where: { id: userId } });
		if (!user) throw new UnauthorizedException('Token không hợp lệ');

		// Loại bỏ password bằng destructuring
		const { password, ...safeUser } = user;
		return safeUser;
	}


}
