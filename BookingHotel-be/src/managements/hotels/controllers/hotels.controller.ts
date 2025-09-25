import { Controller } from '@nestjs/common';
import { HotelsService } from '../services/hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}
}
