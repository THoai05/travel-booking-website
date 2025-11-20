// src/push-web/push-web.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushSubscription } from './entities/push-subscription.entity';
import { User } from 'src/managements/users/entities/users.entity';
import * as webpush from 'web-push';

@Injectable()
export class PushWebService {
    constructor(
        @InjectRepository(PushSubscription)
        private pushRepo: Repository<PushSubscription>,

        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) {
        webpush.setVapidDetails(
            'mailto:your-email@example.com',
            'BNFtbUrK1TkBAiehTvi_kmtycIqRuH4NdvYIApYGGZr6JoN36n8zhJUN6DwtO97DHXHfVyv-U73eV2cbN-KuCXE', // publicKey
            'mzeM9dHUCJkTl8iiuBEKRQmFae-3owGAng06KK3PQ6g' // privateKey
        );
    }

    async subscribe(userId: number, subscription: any) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        // kiểm tra đã tồn tại subscription chưa
        const exists = await this.pushRepo.findOne({
            where: { user: { id: userId }, endpoint: subscription.endpoint },
        });

        if (exists) return exists;

        const ps = this.pushRepo.create({
            user,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
        });

        return this.pushRepo.save(ps);
    }

    async sendToUser(userId: number, payload: { title: string; message: string; url?: string }) {
        const subs = await this.pushRepo.find({ where: { user: { id: userId } } });

        const notificationPayload = JSON.stringify({
            title: payload.title,
            message: payload.message,
            url: payload.url ?? '/',
        });

        for (const sub of subs) {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.p256dh,
                            auth: sub.auth,
                        },
                    },
                    notificationPayload
                );
            } catch (err) {
                console.error('Web push failed for endpoint:', sub.endpoint, err);
            }
        }
    }
}
