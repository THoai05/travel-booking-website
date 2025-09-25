import { Controller } from '@nestjs/common';
import { CouponsService } from '../services/coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}
}
