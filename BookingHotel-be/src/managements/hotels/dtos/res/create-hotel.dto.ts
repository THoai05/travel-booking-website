import {
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsArray,
    IsInt,
} from 'class-validator';

export class CreateHotelDto {
    @IsString()
    name: string;

    @IsString()
    description?: string;

    @IsString()
    address: string;

    @IsString()
    country: string;

    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    policies?: string;

    @IsString()
    @IsOptional()
    checkInTime?: string;

    @IsString()
    checkOutTime: string;

    @IsInt()
    cityId: number;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsOptional()
    avgPrice?: number;

    /** amenity ids */
    @IsArray()
    @IsOptional()
    amenities?: number[];
}
