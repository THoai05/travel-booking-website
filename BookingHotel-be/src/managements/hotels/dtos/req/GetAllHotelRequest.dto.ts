import { 
  IsOptional, 
  Min, 
  Max, 
  IsArray, 
  IsString, 
  IsNumber,
  
} from 'class-validator';
import { Type , Transform} from 'class-transformer';

export class GetAllHotelRequest {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Số thứ tự trang phải lớn hơn hoặc bằng 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : Number(value))
  @IsNumber()
  @Min(1)
  @Max(6)
  star?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    // nếu FE gửi amenities[] thì value có thể là string[] hoặc string
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  })
  amenities?: string[];

}
