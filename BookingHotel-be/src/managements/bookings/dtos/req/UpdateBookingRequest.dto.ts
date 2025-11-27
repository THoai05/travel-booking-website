import {  IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateBookingRequest{
    @IsOptional()
    @IsString()
    contactFullName?: string

    @IsOptional()
    @IsString()
    contactEmail?: string 
    
    @IsOptional()
    @IsString()
    contactPhone?: string
    
    @IsOptional()
    @IsString()
    guestsFullName?: string

    @IsOptional()
    @IsString()
    status?: string

    @IsOptional()
    @IsString()
    couponCode?: string

    @IsOptional()
    @IsNumber()
    couponId?: number

    @IsOptional()
    @IsNumber()
    totalPrice?:number
}