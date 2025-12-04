import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    console.log("DEBUG findOne id:", id);
    const faq = await this.faqRepository.findOne({ where: { id } });
    console.log("DEBUG faq:", faq);
    if (!faq) throw new NotFoundException(`FAQ with ID ${id} không tìm thấy`);
    return faq;
  }



  create(createFaqDto: CreateFaqDto) {
    const faq = this.faqRepository.create(createFaqDto);
    return this.faqRepository.save(faq);
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ không tồn tại');

    // Kiểm tra xung đột updated_at
    if (updateFaqDto.updated_at) {
      const clientTime = new Date(updateFaqDto.updated_at).getTime();
      const serverTime = faq.updated_at.getTime();
      if (clientTime !== serverTime) {
        throw new ConflictException('FAQ đã được cập nhật ở nơi khác. Vui lòng tải lại trang.');
      }
    }

    await this.faqRepository.update(id, updateFaqDto);
    return this.findOne(id);
  }


  async remove(id: number) {
    const result = await this.faqRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return { message: 'Delete successfully' };
  }

}
