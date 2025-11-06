// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/chat.entity';
import { User } from '../users/entities/users.entity';
import { ChatController } from './chat.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Message, User])],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
    exports: [ChatService],
})
export class ChatModule { }
