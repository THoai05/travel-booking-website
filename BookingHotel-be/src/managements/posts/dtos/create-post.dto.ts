import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author_name: string; 

  @IsString()       
  @IsOptional()
  city_title?: string; 

  @IsString()
  @IsOptional()
  @IsString({ each: true }) // mỗi phần tử trong mảng là string
  image?: string;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;

  @IsString()
  @IsOptional()
  slug?: string;
}
