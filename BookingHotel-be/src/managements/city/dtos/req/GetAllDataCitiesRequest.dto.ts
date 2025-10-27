import {  IsNumberString, IsOptional, MinLength ,IsString} from "class-validator"


export class GetAllDataCitiesRequest{
    @IsNumberString({},{message:'Phải là số'})
    @MinLength(1,{message:'Số thự tự trang phải lớn hơn 1'})
    @IsOptional()
    page?: string
            
    @IsNumberString({},{message:'Phải là số'})
    @IsOptional()
    limit?: string

}