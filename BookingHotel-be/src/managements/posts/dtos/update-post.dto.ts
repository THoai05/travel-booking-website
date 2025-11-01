import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsBoolean()
    is_public?: boolean;
}
