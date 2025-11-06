import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { ProviderLogin } from '../entities/users.entity'


export class GoogleRegisterDto {
    @IsString({ message: 'Tên đăng nhập phải là kí không phải hình đặc biệt' })
    @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
    @MinLength(3, { message: 'Tên đăng nhập phải ít nhất có 3 kí tự' })
    @MaxLength(20, { message: 'Tên đăng nhập chỉ được tối đa 20 kí tự' })
    username: string


    @IsString()
    fullName: string
    
    @IsString()
    phone:string
    
    
    
    @IsString({ message: 'Email phải là chuỗi không phải hình đặc biệt' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail()
    email: string

    @IsString({ message: 'Phải có google id' })
    @IsNotEmpty()
    googleId: string
    
    @IsEnum(ProviderLogin)
    provider:ProviderLogin.GOOGLE
   
}