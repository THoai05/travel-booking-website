import { Controller } from '@nestjs/common';
import { ImagesService } from '../services/images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
}
