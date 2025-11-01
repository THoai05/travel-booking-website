import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/users.entity';
import { City } from '../city/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, City])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
