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
import { join } from 'path';
import { promises as fs } from 'fs';
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
    const { title, content, author_name, image, slug, city_title } = createPostDto;

    // Tạo slug tự động nếu chưa có
    const finalSlug =
      slug && slug.trim().length > 0
        ? slugify(slug, { lower: true, strict: true })
        : slugify(title, { lower: true, strict: true });

    const existingSlug = await this.postRepo.findOne({ where: { slug: finalSlug } });
    if (existingSlug) throw new BadRequestException('Slug đã tồn tại, vui lòng chọn slug khác.');

    // Lấy author theo username hoặc fullName
    const author = await this.userRepo.findOne({
      where: [{ username: author_name }, { fullName: author_name }]
    });
    if (!author) throw new NotFoundException('Không tìm thấy tác giả');

    // Lấy city theo title
    let city: City | null = null;
    if (city_title) {
      city = await this.cityRepo.findOne({ where: { title: city_title } });
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

    return {
      message: 'Tạo bài viết thành công',
      post: {
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
      },
    };
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      // Multer đã lưu file, chỉ cần tạo URL truy cập
      urls.push(`/uploads/posts/${file.filename}`);
    }

    return urls;
  }

  async findAll(page = 1, limit = 10) {
    const [posts, total] = await this.postRepo.findAndCount({
      relations: ['author', 'city'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = posts.map((post) => new PostResponseDto(post));

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
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

  async removeMany(ids: number[]) {
    // Xóa nhiều theo id
    const result = await this.postRepo.delete(ids);
    return { deletedCount: result.affected || 0 };
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