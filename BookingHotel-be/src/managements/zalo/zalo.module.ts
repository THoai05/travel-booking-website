import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloChat } from './entities/zalo.entity';
import { ZaloChatService } from './zalo.service';
import { ZaloChatController } from './zalo.controller';
import { ZaloChatGateway } from './zalo.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([ZaloChat])],
    controllers: [ZaloChatController],
    providers: [ZaloChatService, ZaloChatGateway],
    exports: [ZaloChatService],
})
export class ZaloChatModule { }
