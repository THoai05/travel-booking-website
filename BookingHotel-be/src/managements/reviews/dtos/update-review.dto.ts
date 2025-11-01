import { IsInt, IsOptional, Max, Min, MaxLength } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @MaxLength(500)
  comment?: string | null;
}
