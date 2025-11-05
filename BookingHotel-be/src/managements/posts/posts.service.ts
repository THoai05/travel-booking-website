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
import { ILike } from 'typeorm';
import { PostImage } from './entities/post_images.entity';

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
    const { title, content, author_name, images, slug, city_title } = createPostDto;

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

    // Tạo Post mới
    const newPost = this.postRepo.create({
      title,
      content,
      slug: finalSlug,
      author,
      city,
    });

    // Chuyển mảng image (string[]) sang PostImage[]
    if (images && images.length > 0) {
      newPost.images = images.map((url: string) => {
        const img = new PostImage();
        img.url = url;
        return img;
      });
    }

    await this.postRepo.save(newPost); // cascade sẽ tự lưu PostImage

    return {
      message: 'Tạo bài viết thành công',
      post: {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        images: newPost.images.map(img => img.url), // trả về mảng URL
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
      where: { is_public: true },
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

  async searchPosts(keyword: string) {
    if (!keyword?.trim()) return [];

    const normalizedKeyword = this.removeAccents(keyword.toLowerCase());

    // Lấy hết bài public
    const posts = await this.postRepo.find({
      relations: ['author', 'city'],
      where: { is_public: true },
    });

    // Lọc lại bỏ dấu cả 2 bên
    return posts.filter((post) => {
      const combinedText = [
        post.title,
        post.content,
        post.city?.title,
      ]
        .join(' ')
        .toLowerCase();

      return this.removeAccents(combinedText).includes(normalizedKeyword);
    });
  }

  removeAccents(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

}