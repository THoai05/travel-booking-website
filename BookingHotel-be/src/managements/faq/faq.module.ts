// src/managements/faqs/faqs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])], // ✅ Quan trọng!
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService], // nếu cần dùng ở module khác
})
export class FaqModule { }
