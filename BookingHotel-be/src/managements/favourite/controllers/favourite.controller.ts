import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { FavouritesService } from '../services/favourite.service';

@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) { }

  // 🟢 Lấy danh sách yêu thích của 1 user
  @Get()
  async getFavourites(@Query('userId') userId: number) {
    return this.favouritesService.findAllByUser(userId);
  }

  // 🟢 API Thống kê tổng hợp
  @Get('analytics')
  async getAnalytics() {
    const analyticsData = await this.favouritesService.getAnalytics();

    return {
      message: 'Thống kê lượt yêu thích thành công',
      data: analyticsData, // ✅ trả về đúng format JSON bạn muốn
    };
  }

  // 🟢 Thêm mới yêu thích
  @Post()
  async addFavourite(
    @Body() body: { userId: number; hotelId?: number; roomId?: number },
  ) {
    return this.favouritesService.create(body.userId, body.hotelId, body.roomId);
  }

  // 🟢 Xóa yêu thích
  @Delete(':id')
  async deleteFavourite(@Param('id') id: number) {
    return this.favouritesService.remove(id);
  }
}
