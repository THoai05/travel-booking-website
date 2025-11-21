// src/push-web/push-web.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushWebService } from './push-web.service';
import { PushWebController } from './push-web.controller';
import { PushSubscription } from './entities/push-subscription.entity';
import { User } from 'src/managements/users/entities/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PushSubscription, User])],
    providers: [PushWebService],
    controllers: [PushWebController],
    exports: [PushWebService],
})
export class PushWebModule { }
