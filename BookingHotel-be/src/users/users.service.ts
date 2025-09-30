import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, Gender } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: RegisterUserDto): Promise<User> {
    if (!userData.password) throw new Error('Password is required');

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user: Partial<User> = {
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      dob: userData.dob ? new Date(userData.dob) : undefined,
      gender: userData.gender as Gender | undefined,
      password: hashedPassword,
    };

    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
}
