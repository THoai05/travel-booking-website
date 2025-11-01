import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from '../service/contact.service';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    async sendContact(@Body() body: { name: string; email: string; message: string }) {
        const { name, email, message } = body;
        if (!name || !email || !message) {
            throw new Error('Vui lòng điền đầy đủ thông tin');
        }
        return this.contactService.sendAndSave({ name, email, message });
    }
}
