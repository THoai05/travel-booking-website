import { IsOptional, IsString } from "class-validator";

export class GetDataCitiesFilterRequest{
    @IsString()
    @IsOptional()
    title?:string
}