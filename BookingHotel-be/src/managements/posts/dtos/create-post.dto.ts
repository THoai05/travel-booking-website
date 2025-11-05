import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';

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

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;

  @IsString()
  @IsOptional()
  slug?: string;
}
