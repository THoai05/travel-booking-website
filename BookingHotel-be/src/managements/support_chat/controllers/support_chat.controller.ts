import { Controller } from '@nestjs/common';
import { SupportChatService } from '../services/support_chat.service';

@Controller('support-chat')
export class SupportChatController {
  constructor(private readonly supportChatService: SupportChatService) {}
}
