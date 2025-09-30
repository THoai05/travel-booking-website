import { Gender } from '../user.entity';

export class RegisterUserDto {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  dob?: string; // yyyy-mm-dd
  gender?: Gender;
}
