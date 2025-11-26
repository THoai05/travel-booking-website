import { 
  IsNotEmpty, 
  IsString, 
  MaxLength, 
  IsOptional, 
  Matches, 
  IsInt, 
  Min, 
  IsArray, 
  IsNumber
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateRatePlanDto } from './create-rate-plan.dto';
import { CreateRoomTypeDto } from './create-room-types.dto';
import { ValidateNested } from 'class-validator';

export class CreateHotelDto {
  @IsNotEmpty({ message: 'Tên khách sạn không được để trống' })
  @IsString()
  @Transform(({ value }) => value?.trim()) // Fix Bug 6: Tự động cắt khoảng trắng đầu đuôi
  @MaxLength(30, { message: 'Tên quá dài, tối đa 30 ký tự' }) // Fix Bug 5: Chặn text quá dài
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(500, { message: 'Mô tả quá dài' }) 
  description?: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(255, { message: 'Địa chỉ quá dài' })
  address: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  country: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(20)
  // Fix Bug 5 + 7: Chặn ký tự lạ, chặn số full-width tào lao
  @Matches(/^[0-9+ ]+$/, { message: 'Số điện thoại chỉ được chứa số và dấu +' }) 
  phone: string;

  @IsOptional()
  @IsString()
  policies?: string;

  @IsOptional()
  // Validate giờ chuẩn HH:mm
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Check-in time phải là định dạng HH:mm' })
  checkInTime?: string;

  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Check-out time phải là định dạng HH:mm' })
  checkOutTime: string;

  @IsNotEmpty({ message: 'Thành phố không được để trống' })
  @IsInt({ message: 'CityId phải là số nguyên' }) // Fix Bug 7: Chặn số full-width text
  @Min(1)
  cityId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  avgPrice?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'ID tiện ích phải là số' }) // Validate từng phần tử trong mảng
  amenities?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Validate từng RoomType
  @Type(() => CreateRoomTypeDto)  // Convert JSON sang Class
  roomTypes?: CreateRoomTypeDto[];
}