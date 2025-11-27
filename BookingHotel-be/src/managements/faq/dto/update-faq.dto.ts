import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqDto } from './create-faq.dto';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {
    updated_at?: string; // thêm dòng này
}
