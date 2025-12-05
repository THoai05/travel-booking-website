import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from '../controller/contact.controller';
import { ContactService } from '../service/contact.service';
import { Contact } from '../entities/contact.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Contact]),
    ],
    controllers: [ContactController],
    providers: [ContactService],
    exports: [ContactService],
})
export class ContactModule { }
