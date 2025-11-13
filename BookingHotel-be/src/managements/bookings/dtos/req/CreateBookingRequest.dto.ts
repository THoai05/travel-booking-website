import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookingRequest{
    @IsOptional()
    @IsDateString()
    checkinDate?: string
    
    @IsOptional()
    @IsDateString()
    checkoutDate?: string
    
    @IsOptional()
    @IsNumber()
    guestsCount?: number
    
    @IsOptional()
    @IsNumber()
    totalPrice?: number
    
    @IsOptional()
    @IsNumber()
    userId?: number

    @IsOptional()
    @IsNumber()
    roomTypeId?: number

    @IsOptional()
    @IsNumber()
    ratePlanId?: number

}