import { 
  IsString, 
  IsEmail, 
  MinLength, 
  MaxLength, 
  Matches, 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  ValidateIf, 
  ValidationArguments, 
  ValidatorConstraint, 
  ValidatorConstraintInterface, 
  Validate 
} from 'class-validator';

// Enum gender
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

// Custom validator để kiểm tra DOB không quá lớn (không lớn hơn ngày hôm nay)
@ValidatorConstraint({ name: 'dobBeforeToday', async: false })
export class DobBeforeToday implements ValidatorConstraintInterface {
  validate(dob: string) {
    if (!dob) return true; // optional
    const date = new Date(dob);
    const today = new Date();
    return date <= today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Ngày sinh không được lớn hơn ngày hiện tại';
  }
}

export class RegisterUserDto {
  @IsString()
  @MinLength(3, { message: 'Username phải ít nhất 3 ký tự' })
  @MaxLength(50, { message: 'Username không được quá 50 ký tự' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username chỉ được chứa chữ, số và _' })
  username: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải từ 8 ký tự trở lên' })
  @MaxLength(255)
  password: string;

  @IsString()
  @MaxLength(100)
  full_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  @Validate(DobBeforeToday)
  dob?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  gender?: Gender;
}
