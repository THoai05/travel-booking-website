import { IsOptional, IsString } from "class-validator";

export class RandomCouponByTitleRequest{
    @IsOptional()
    @IsString()
    title?:string
}