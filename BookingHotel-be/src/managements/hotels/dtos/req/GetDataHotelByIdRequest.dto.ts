import { IsInt, IsNotEmpty } from "class-validator";

export class GetDataHotelByIdRequest{
    @IsNotEmpty()
    @IsInt()
    id:number
}