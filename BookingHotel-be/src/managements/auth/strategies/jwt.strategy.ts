import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/managements/users/services/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
                private readonly userService:UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    let token = null
                    if (request && request.cookies) {
                        token = request.cookies['access_Token']
                    }
                    return token
                }
            ]),
            ignoreExpiration: false,
            secretOrKey:configService.get<string>('SECRET_KEY')!
        })    
    }

    async validate(payload:JwtPayload) {
        const user = await this.userService.findById(payload.sub)
        if (!user) {
            throw new UnauthorizedException("Không có quyền truy cập")
        }
        return {
            sub: user.id,
            username: user.username,
            role:user.role
        }
    }


}