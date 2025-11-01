import { IsString, IsOptional } from 'class-validator';

export class CreateFaqDto {
    @IsString()
    question: string;

    @IsString()
    answer: string;

    @IsOptional()
    @IsString()
    categories?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
