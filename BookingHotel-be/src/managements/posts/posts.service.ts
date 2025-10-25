import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from 'src/managements/users/entities/users.entity';
import { PostResponseDto } from './dtos/post-response.dto';
import { City } from 'src/managements/city/entities/city.entity';
import slugify from 'slugify';
import { Brackets } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) { }

  async create(createPostDto: CreatePostDto) {
    const { title, content, author_id, image, slug, city_id } = createPostDto;

    // Tạo slug tự động nếu chưa có
    const finalSlug =
      slug && slug.trim().length > 0
        ? slugify(slug, { lower: true, strict: true })
        : slugify(title, { lower: true, strict: true });

    const existingSlug = await this.postRepo.findOne({ where: { slug: finalSlug } });
    if (existingSlug) throw new BadRequestException('Slug đã tồn tại, vui lòng chọn slug khác.');

    const author = await this.userRepo.findOne({ where: { id: author_id } });
    if (!author) throw new NotFoundException('Không tìm thấy tác giả');

    let city: City | null = null;
    if (city_id) {
      city = await this.cityRepo.findOne({ where: { id: city_id } });
      if (!city) throw new NotFoundException('Không tìm thấy thành phố');
    }

    const newPost = this.postRepo.create({
      title,
      content,
      image,
      slug: finalSlug,
      author,
      city,
    });

    await this.postRepo.save(newPost);

    const response = {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      image: newPost.image,
      slug: newPost.slug,
      is_public: newPost.is_public,
      created_at: newPost.created_at,
      author: {
        id: author.id,
        username: author.username,
        fullName: author.fullName,
      },
      city: city
        ? {
          id: city.id,
          title: city.title,
          image: city.image,
        }
        : null,
    };

    return {
      message: 'Tạo bài viết thành công',
      post: response,
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

  async search(keyword?: string, cityName?: string) {
    if (!keyword?.trim() && !cityName?.trim()) {
      return [];
    }

    const query = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.city', 'city')
      .where('post.is_public = true');

    // Nếu có từ khóa
    if (keyword) {
      // Bỏ dấu tiếng Việt
      const normalizedKeyword = keyword
        .normalize('NFD') // tách dấu
        .replace(/[\u0300-\u036f]/g, '') // xoá dấu
        .toLowerCase();

      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(post.title) LIKE :keyword')
            .orWhere('LOWER(post.content) LIKE :keyword');
        }),
        { keyword: `%${normalizedKeyword}%` },
      );
    }

    if (cityName) {
      const normalizedCity = cityName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      query.andWhere('LOWER(city.title) LIKE :cityName', {
        cityName: `%${normalizedCity}%`,
      });
    }

    const posts = await query.orderBy('post.created_at', 'DESC').getMany();
    console.log(posts);
    return posts;
  }
}