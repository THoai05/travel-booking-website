import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ReviewType } from '../entities/review.entity';

export class CreateReviewDto {
  @IsInt()
  hotelId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsEnum(ReviewType)
  reviewType: ReviewType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
