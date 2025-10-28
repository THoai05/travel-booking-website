import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) { }

  findAll() {
    return this.faqRepository.find({ order: { created_at: 'DESC' } });
  }

  findOne(id: number) {
    return this.faqRepository.findOne({ where: { id } });
  }

  create(createFaqDto: CreateFaqDto) {
    const faq = this.faqRepository.create(createFaqDto);
    return this.faqRepository.save(faq);
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    await this.faqRepository.update(id, updateFaqDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.faqRepository.delete(id);
  }
}
