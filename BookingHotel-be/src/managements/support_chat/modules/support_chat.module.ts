import { Module } from '@nestjs/common';
import { SupportChatService } from '../services/support_chat.service';
import { SupportChatController } from '../controllers/support_chat.controller';

@Module({
  controllers: [SupportChatController],
  providers: [SupportChatService],
})
export class SupportChatModule {}
