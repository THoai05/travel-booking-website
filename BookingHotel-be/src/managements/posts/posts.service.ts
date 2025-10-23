import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from 'src/managements/users/entities/users.entity';
import { PostResponseDto } from './dtos/post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(createPostDto: CreatePostDto) {
    const { title, content, author_id, image, slug } = createPostDto;

    // Kiểm tra slug trùng
    const existingSlug = await this.postRepo.findOne({ where: { slug } });
    if (existingSlug) {
      throw new BadRequestException('Slug đã tồn tại, vui lòng chọn slug khác.');
    }

    const author = await this.userRepo.findOne({ where: { id: author_id } });
    if (!author) {
      throw new NotFoundException('Không tìm thấy tác giả');
    }

    const newPost = this.postRepo.create({
      title,
      content,
      image,
      slug,
      author,
    });

    await this.postRepo.save(newPost);

    return {
      message: 'Tạo bài viết thành công',
      post: newPost,
    };
  }

  async findAll() {
    const posts = await this.postRepo.find({
      relations: ['author'],
      order: { created_at: 'DESC' },
    });

    return posts.map((post) => new PostResponseDto(post));
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('Không tìm thấy bài viết');

    return new PostResponseDto(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }
    // Kiểm tra slug trùng nếu có thay đổi slug
    if (updatePostDto.slug) {
      const existingSlug = await this.postRepo.findOne({
        where: { slug: updatePostDto.slug },
      });

      if (existingSlug && existingSlug.id !== id) {
        throw new BadRequestException('Slug đã tồn tại');
      }
    }
    
    Object.assign(post, updatePostDto);
    await this.postRepo.save(post);

    return {
      message: 'Cập nhật bài viết thành công',
      post: new PostResponseDto(post),
    };
  }


  async remove(id: number) {
    const result = await this.postRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Không tìm thấy bài viết');

    return { message: 'Xóa bài viết thành công' };
  }
}
