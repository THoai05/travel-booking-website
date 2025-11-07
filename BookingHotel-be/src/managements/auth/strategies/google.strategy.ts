import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ProviderLogin, User } from "src/managements/users/entities/users.entity"
import { Repository } from "typeorm";
import { UsersService } from "src/managements/users/services/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly userService: UsersService,
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>
    ) {
        super({
            clientID: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!,
            callbackURL: process.env.CALLBACK_URL!,
            scope: ['profile', 'email'],
        })
    }

    async validate(accessToken:string,refreshToken:string,profile:any,done:VerifyCallback) {
        const { id,name, emails} = profile
        let user = await this.userService.findByGoogleId(id)
        
        if (!user) {
          user =   await this.userService.createGoogleUser({
                username: name.givenName,
                fullName: name.givenName,
                email: emails[0].value,
                googleId: id,
                phone:'0123456789',
                provider:ProviderLogin.GOOGLE
            })
        } 
        done(null,user)
    }
}