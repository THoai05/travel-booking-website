import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  Min, 
  MaxLength, 
  IsOptional, 
  IsBoolean, 
  IsEnum, 
  IsInt 
} from 'class-validator';
import { Transform } from 'class-transformer';
// Import Enum từ Entity RatePlan của bro
import { CancellationPolicyType, PaymentPolicyType } from 'src/managements/rooms/entities/ratePlans.entity';

export class CreateRatePlanDto {
  @IsNotEmpty({ message: 'Tên gói giá không được để trống' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'Giá gốc không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Giá gốc không được âm' })
  original_price: number;

  @IsNotEmpty({ message: 'Giá bán không được để trống' })
  @IsNumber()
  @Min(0, { message: 'Giá bán không được âm' })
  sale_price: number;

  @IsOptional()
  @IsBoolean()
  includes_breakfast?: boolean;

  @IsNotEmpty({ message: 'Chính sách thanh toán là bắt buộc' })
  @IsEnum(PaymentPolicyType, { message: 'Chính sách thanh toán không hợp lệ (PAY_NOW, PAY_AT_HOTEL, PAY_LATER)' })
  payment_policy: PaymentPolicyType;

  @IsNotEmpty({ message: 'Chính sách hủy là bắt buộc' })
  @IsEnum(CancellationPolicyType, { message: 'Chính sách hủy không hợp lệ' })
  cancellation_policy: CancellationPolicyType;

  @IsOptional()
  @IsInt({ message: 'Số ngày hủy trước hạn phải là số nguyên' })
  @Min(0)
  cancellation_deadline_days?: number;
}