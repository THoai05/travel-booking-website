import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from '../entities/favourite.entity';
import { FavouritesService } from '../services/favourite.service';
import { FavouritesController } from '../controllers/favourite.controller';
import { User } from '../../../managements/users/entities/users.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Room } from '../../rooms/entities/rooms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite, User, Hotel, Room])],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule { }
