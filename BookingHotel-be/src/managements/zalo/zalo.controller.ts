import {
    Controller, Get, Param, Post, Body, UploadedFile, UseInterceptors, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

import { ZaloChatService } from './zalo.service';
import { ZaloChatGateway } from './zalo.gateway';

@Controller('zalo')
export class ZaloChatController {
    constructor(
        private readonly zaloChatService: ZaloChatService,
        private readonly zaloChatGateway: ZaloChatGateway,
    ) { }

    @Get(':userId/:adminId')
    async getHistory(@Param('userId') userId: string, @Param('adminId') adminId: string) {
        return await this.zaloChatService.getChatHistory(Number(userId), Number(adminId));
    }

    // Method cũ gửi text, file, v.v
    @Post('send')
    async sendMessage(@Body() body: any) {
        const msg = await this.zaloChatService.createMessage(body);
        this.zaloChatGateway.emitMessage(msg);
        return msg;
    }

    // Method mới: gửi ảnh
    // zalo.controller.ts
    @Post('send-image')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/zalo',
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueName);
            },
        }),
    }))
    async sendImage(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        const msg = await this.zaloChatService.createMessage({
            sender_id: Number(body.sender_id),
            receiver_id: Number(body.receiver_id),
            message: '', // không cần message text
            type: 'image',
            file_url: `/uploads/zalo/${file.filename}`, // ✅ trùng interface
        });

        this.zaloChatGateway.emitMessage(msg);
        return msg;
    }


}
