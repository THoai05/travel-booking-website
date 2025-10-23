import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }
  
  @Get('hotel/:id')
  async handleGetReviewsByHotelId(@Param('id',ParseIntPipe) id:number) {
    return await this.reviewsService.getReviewsByHotelId(id)
  }
}
  