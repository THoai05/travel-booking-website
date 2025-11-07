import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
    async canActivate(context: ExecutionContext) {
        const active = (await super.canActivate(context)) as boolean
        const request = context.switchToHttp().getRequest()
        return active; 
    }
}