import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { JwtAuthGuard } from 'src/managements/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadReviewImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await this.postsService.uploadImages(files);
    return {
      message: 'Uploaded successfully',
      urls,
    };
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postsService.findAll(page, limit);
  }

  @Get('search')
  async searchPosts(@Query('keyword') keyword: string) {
    return this.postsService.searchPosts(keyword);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  removeMany(@Body() body: { ids: number[] }) {
    return this.postsService.removeMany(body.ids);
  }

}
