// src/push-web/dto/subscribe.dto.ts
export class SubscribeDto {
    userId: number;
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    };
}
