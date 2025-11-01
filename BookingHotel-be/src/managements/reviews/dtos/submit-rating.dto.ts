import { IsInt, Min, Max } from 'class-validator';

export class SubmitRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  hotelId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
