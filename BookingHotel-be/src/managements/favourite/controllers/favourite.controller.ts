import { Controller } from '@nestjs/common';
import { FavouriteService } from '../services/favourite.service';

@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}
}
