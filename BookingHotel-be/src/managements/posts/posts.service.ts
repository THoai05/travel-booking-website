import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from 'src/managements/users/entities/users.entity';

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

    const author = await this.userRepo.findOne({ where: { id: author_id } });
    if (!author) throw new NotFoundException('Không tìm thấy tác giả');

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
    return this.postRepo.find({
      relations: ['author'], // load luôn user author
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException('Không tìm thấy bài viết');
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Không tìm thấy bài viết');

    Object.assign(post, updatePostDto);
    await this.postRepo.save(post);

    return { message: 'Cập nhật thành công', post };
  }

  async remove(id: number) {
    const result = await this.postRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Không tìm thấy bài viết');

    return { message: 'Xóa bài viết thành công' };
  }
}
