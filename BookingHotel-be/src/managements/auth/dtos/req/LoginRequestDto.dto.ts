import { IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto{
    @IsString({message:"Tên tài khoản phải là một chuỗi hợp lệ"})
    @IsNotEmpty({message:"Tên tài khoản không được để trống"})
    usernameOrEmail:string


    @IsString({message:"Mật khẩu phải là một chuỗi hợp lệ"})
    @IsNotEmpty({message:"Mật khẩu không được để trống"})
    password:string
}