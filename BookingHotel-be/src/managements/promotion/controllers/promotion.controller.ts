import { Controller } from '@nestjs/common';
import { PromotionService } from '../services/promotion.service';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}
}
