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
  
  async findByPhone(phone: string): Promise<User | null> {
	return this.usersRepository.findOne({ where: { phone } });
  }
	
	async validateUser(usernameOrEmail: string, password: string): Promise<Omit<User,'password'> | null> {
		const user = await this.usersRepository.findOne({
		  where: [
			{ username: usernameOrEmail },
			{ email: usernameOrEmail },
		  ],
		});

		if (!user) return null;

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) return null;

		const { password: _, ...result } = user;
		return result;
	 }
	 
  // 🔑 Hàm updatePassword để reset mật khẩu
  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(userId, { password: hashedPassword });
  }
  
  
	async updateUser(id: number, data: Partial<User>): Promise<User> {
	  await this.usersRepository.update(id, data);
	  const updatedUser = await this.findById(id);
	  if (!updatedUser) {
		throw new Error('User not found after update');
	  }
	  return updatedUser;
	}
		
	async findById(id: number): Promise<User | null> {
	  return this.usersRepository.findOne({ where: { id } });
	}


}
