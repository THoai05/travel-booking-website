import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { FavouritesService } from '../services/favourite.service';

@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) { }

  // Lấy danh sách yêu thích của 1 user
  @Get()
  async getFavourites(@Query('userId') userId: number) {
    return this.favouritesService.findAllByUser(userId);
  }

  // Thêm mới
  @Post()
  async addFavourite(
    @Body() body: { userId: number; hotelId?: number; roomId?: number },
  ) {
    return this.favouritesService.create(body.userId, body.hotelId, body.roomId);
  }

  // Xóa
  @Delete(':id')
  async deleteFavourite(@Param('id') id: number) {
    return this.favouritesService.remove(id);
  }
}
