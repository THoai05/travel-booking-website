import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UnauthorizedException, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { Request } from 'express';
import { UsersService } from 'src/managements/users/services/users.service';
import { JwtAuthGuard } from 'src/managements/auth/guards/jwt-auth.guard';
import { SubmitRatingDto } from '../dtos/submit-rating.dto';
import { UpdateReviewDto } from '../dtos/update-review.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly userService: UsersService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('hotel/:id')
  async handleGetReviewsByHotelId(
    @Param('id', ParseIntPipe) hotelId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req: Request,
  ) {
    const userId = req.user?.userId;
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);

    const result = await this.reviewsService.getReviewsByHotelId(
      hotelId,
      pageNum,
      limitNum,
      userId,
    );

    return { message: 'Fetched reviews successfully', ...result };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(@Body() dto: CreateReviewDto, @Req() req: any) {
    const userId = req.user?.userId || req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }

    return await this.reviewsService.createReview(dto, userId);
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadReviewImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await this.reviewsService.uploadImages(files);
    return {
      message: 'Uploaded successfully',
      urls,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
    @Req() req: Request
  ) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('User not found in request');
    return this.reviewsService.updateReview(id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('User not found in request');
    return this.reviewsService.deleteReview(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeReview(@Param('id', ParseIntPipe) reviewId: number, @Req() req: Request) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('User not found in request');
    return this.reviewsService.toggleLikeReview(reviewId, userId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('hotel/rate')
  // async submitRating(@Body() dto: SubmitRatingDto, @Req() req: Request) {
  //   const userId = req.user?.userId;
  //   if (!userId) {
  //     throw new UnauthorizedException('User not found in request');
  //   }
  //   return this.reviewsService.submitRating(dto, userId);
  // }
}
