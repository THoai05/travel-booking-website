// src/push-web/push-web.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PushWebService } from './push-web.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller('push-web')
export class PushWebController {
    constructor(private readonly pushService: PushWebService) { }

    @Post('subscribe')
    async subscribe(@Body() dto: SubscribeDto) {
        return this.pushService.subscribe(dto.userId, dto.subscription);
    }
}
