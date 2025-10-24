import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetPassword } from '../entities/reset_Password.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResetPasswordService {
    private otpStore = new Map<string, { code: string; expiresAt: number }>();
    private OTP_EXPIRE_MS = 5 * 60 * 1000; // 5 phút

    constructor(
        @InjectRepository(ResetPassword)
        private readonly resetRepo: Repository<ResetPassword>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async createResetToken(user: User, expireMinutes = 5): Promise<string> {
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);

        const reset = this.resetRepo.create({ user, token, expires_at: expiresAt });
        await this.resetRepo.save(reset);
        return token;
    }

    async sendResetLink(user: User) {
        const token = await this.createResetToken(user);
        // Trả token về cho frontend để frontend gửi email bằng EmailJS
        return { message: 'Token generated. Use frontend to send email.', token };
    }

    async sendOTP(user: User) {
        const token = await this.createResetToken(user);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpStore.set(user.email, { code, expiresAt: Date.now() + this.OTP_EXPIRE_MS });
        // Trả OTP về frontend, frontend sẽ gửi email qua EmailJS
        return { message: 'OTP generated. Use frontend to send email.', code, token };
    }

    verifyOtp(email: string, code: string) {
        const entry = this.otpStore.get(email);
        if (!entry || entry.code !== code || entry.expiresAt < Date.now()) {
            throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
        }
        this.otpStore.delete(email);
        return true;
    }

    async validateToken(token: string): Promise<User> {
        const reset = await this.resetRepo.findOne({ where: { token }, relations: ['user'] });
        if (!reset || reset.expires_at < new Date()) throw new NotFoundException('Token invalid or expired');
        return reset.user;
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.validateToken(token);
        user.password = newPassword; // có thể hash bằng bcrypt
        await this.userRepo.save(user);
        await this.resetRepo.delete({ token });
        return { message: 'Password reset successfully' };
    }
}
