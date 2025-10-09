import { IsOptional, IsString, IsEmail, IsDateString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  full_name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  email?: string;

  @IsOptional()
  @Matches(/^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/, {
    message: 'Phone number is not valid in Vietnam',
  })
  phone?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date string' })
  dob?: string;

  @IsOptional()
  @IsString()
  gender?: 'male' | 'female' | 'other';
}
