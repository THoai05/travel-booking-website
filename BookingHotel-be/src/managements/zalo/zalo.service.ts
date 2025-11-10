// src/common/services/zalo.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ZaloService {
    private readonly logger = new Logger(ZaloService.name);
    private readonly zaloApiUrl = 'https://openapi.zalo.me/v2.0/oa/message'; // ví dụ
    private readonly accessToken = process.env.ZALO_ACCESS_TOKEN;

    async sendBookingNotification(message: string, userId: string) {
        try {
            // Gửi request POST đến Zalo OA
            await axios.post(this.zaloApiUrl, {
                recipient: { user_id: userId },
                message: { text: message },
            }, {
                headers: {
                    'access_token': this.accessToken,
                    'Content-Type': 'application/json',
                }
            });

            this.logger.log(`Sent Zalo message to user ${userId}`);
        } catch (error) {
            this.logger.error(`Failed to send Zalo message: ${error.message}`);
        }
    }
}
