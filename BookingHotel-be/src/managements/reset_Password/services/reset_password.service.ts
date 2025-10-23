import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordReset } from './password-reset.entity';
import { User } from '../users/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PasswordResetsService {
  constructor(
    @InjectRepository(PasswordReset)
    private resetRepo: Repository<PasswordReset>,
  ) {}

  async createResetToken(user: User, expireMinutes = 15): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);

    const reset = this.resetRepo.create({ user, token, expires_at: expiresAt });
    await this.resetRepo.save(reset);
    return token;
  }

  async validateToken(token: string): Promise<User> {
    const reset = await this.resetRepo.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!reset || reset.expires_at < new Date()) {
      throw new NotFoundException('Token không hợp lệ hoặc đã hết hạn');
    }

    return reset.user;
  }

  async deleteToken(token: string) {
    await this.resetRepo.delete({ token });
  }
}
