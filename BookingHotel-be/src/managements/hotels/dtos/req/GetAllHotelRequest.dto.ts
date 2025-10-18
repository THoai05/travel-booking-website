import {  IsNumberString, IsOptional, MinLength } from "class-validator"


export class GetAllHotelRequest{
    @IsNumberString({},{message:'Phải là số'})
    @MinLength(1,{message:'Số thự tự trang phải lớn hơn 1'})
    @IsOptional()
    page?: string
            
    @IsNumberString({},{message:'Phải là số'})
    @IsOptional()
    limit?: string

    
}