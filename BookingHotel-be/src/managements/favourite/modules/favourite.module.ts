import { Module } from '@nestjs/common';
import { FavouriteService } from '../services/favourite.service';
import { FavouriteController } from '../controllers/favourite.controller';

@Module({
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule {}
