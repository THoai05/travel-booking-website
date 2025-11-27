import { Controller, Req, Get, Post, Body } from '@nestjs/common';
import { PushWebService } from './push-web.service';

@Controller('push-web')
export class PushWebController {
    constructor(private readonly pushService: PushWebService) { }


    @Post('subscribe')
    async subscribe(@Body() body: { userId: number; subscription: any }) {
        return this.pushService.subscribe(body.userId, body.subscription);
    }

    @Post('broadcast')
    async broadcast(@Body() body: { title: string; message: string; url?: string }) {
        await this.pushService.broadcast({
            title: body.title,
            message: body.message,
            url: body.url,
        });
        return { message: 'Notification broadcast sent!' };
    }

}
