
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { ProviderLogin } from 'src/managements/users/entities/users.entity';
import { UsersService } from 'src/managements/users/services/users.service';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            clientID: configService.get<string>('CLIENT_GITHUB_ID'),
            clientSecret: configService.get<string>('CLIENT_GITHUB_SECRET'),
            callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
            scope: ['read:user', 'user:email']
        });
    }

   async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const { id, username, displayName, emails, photos, _json } = profile;

    const email = emails?.[0]?.value || _json?.email||"haconghau097@gmail.com";
    const fullName = displayName || _json?.name || username;

    let user = await this.usersService.findByGithubId(id);

    if (!user) {
      user = await this.usersService.createGithubUser({
        username,
        fullName,
        email,
        githubId: id,
        phone: '0123456789',
        provider: ProviderLogin.GITHUB,
      });
    }

    return user;
  }
}
