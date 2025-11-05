import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/users.entity';
import { City } from '../city/entities/city.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { PostImage } from './entities/post_images.entity';

@Module({
  imports: [
     MulterModule.register({
          storage: diskStorage({
            destination: join(process.cwd(), 'uploads/posts'),
            filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              cb(null, uniqueSuffix + '-' + file.originalname);
            },
          }),
        }),
    TypeOrmModule.forFeature([Post, User, City, PostImage])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
