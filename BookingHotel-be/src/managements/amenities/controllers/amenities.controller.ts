import { Controller } from '@nestjs/common';
import { AmenitiesService } from '../services/amenities.service';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}
}
