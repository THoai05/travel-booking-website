import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { Request } from 'express';
import { UsersService } from 'src/managements/users/services/users.service';
import { JwtAuthGuard } from 'src/managements/auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly userService: UsersService
  ) { }


  @Get('hotel/:id')
  async handleGetReviewsByHotelId(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewsService.getReviewsByHotelId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(@Body() dto: CreateReviewDto, @Req() req: Request) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }
    console.log('Creating review for userId:', userId);
    return await this.reviewsService.createReview(dto, userId);
  }
}
