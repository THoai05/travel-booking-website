// src/push-web/dto/subscribe.dto.ts
import { IsNumber, IsObject, IsString } from 'class-validator';

export class SubscribeDto {
    @IsNumber()
    userId: number;

    @IsObject()
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    };
}
