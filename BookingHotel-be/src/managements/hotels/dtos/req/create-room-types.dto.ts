import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  Min, 
  MaxLength, 
  IsOptional, 
  ValidateNested, 
  IsArray, 
  IsEnum,
  IsInt
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateRatePlanDto } from './create-rate-plan.dto';
// Import Enum RoomTypeName từ Entity RoomType
import { RoomTypeName } from 'src/managements/rooms/entities/roomType.entity';

export class CreateRoomTypeDto {
  @IsNotEmpty({ message: 'Loại phòng là bắt buộc' })
  @IsEnum(RoomTypeName, { 
    message: 'Tên loại phòng không hợp lệ. Phải thuộc danh sách: deluxe double, standard, v.v.' 
  })
  name: RoomTypeName; // Vì Entity để enum nên DTO phải bắt enum

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(5000, { message: 'Mô tả quá dài' }) // Text có thể dài hơn varchar
  description: string;

  @IsNotEmpty({ message: 'Số lượng khách tối đa là bắt buộc' })
  @IsInt()
  @Min(1, { message: 'Sức chứa phải ít nhất 1 người' })
  max_guests: number;

  @IsNotEmpty({ message: 'Tổng số lượng phòng (Inventory) là bắt buộc' })
  @IsInt()
  @Min(0)
  total_inventory: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(50)
  area?: string;

  @IsNotEmpty({ message: 'Loại giường là bắt buộc' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  bed_type: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number; // Mặc định là 10 trong entity, nhưng cho phép ghi đè

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Quan trọng: Validate từng item bên trong mảng RatePlan
  @Type(() => CreateRatePlanDto) // Map JSON sang Class DTO để validate
  ratePlans?: CreateRatePlanDto[];
}