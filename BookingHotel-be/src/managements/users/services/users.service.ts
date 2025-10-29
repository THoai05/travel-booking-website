import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    // Kiểm tra trùng email (nếu có cập nhật email)
    if (data.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: data.email },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Email đã được sử dụng bởi tài khoản khác');
      }
    }

    await this.usersRepository.update(id, data);

    const updatedUser = await this.findById(id);
    if (!updatedUser) throw new BadRequestException('Không tìm thấy người dùng sau khi cập nhật');

    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { id: 'ASC' }, // sắp xếp theo id tăng dần, tuỳ chỉnh được
      select: [
        'id',
        'username',
        'fullName',
        'email',
        'phone',
        'dob',
        'gender',
        'avatar',
        'role',
        'loyaltyPoints',
        'membershipLevel',
        'createdAt',
        'updatedAt',
      ], // chỉ lấy các field cần thiết
    });
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    await this.usersRepository.delete(id);
    return { message: 'Xóa người dùng thành công' };
  }
}
