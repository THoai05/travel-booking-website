import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Post } from 'src/managements/posts/entities/post.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { City } from 'src/managements/city/entities/city.entity';
import { PostImage } from 'src/managements/posts/entities/post_images.entity';

export default class PostSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const postRepo = dataSource.getRepository(Post);
    const userRepo = dataSource.getRepository(User);
    const cityRepo = dataSource.getRepository(City);
    const postImageRepo = dataSource.getRepository(PostImage);

    const users = await userRepo.find();
    const cities = await cityRepo.find();

    if (users.length === 0) {
      console.warn('⚠️  No users found, please seed users first.');
      return;
    }

    // Thay đổi nếu tên trường trong PostImage khác (ví dụ: path, src, etc.)
    const sampleImages = [
      '/uploads/posts/da-nang.jpg',
      '/uploads/posts/post-1.png',
      '/uploads/posts/lauca.jpg',
    ];

    // raw data (tham chiếu tới images bằng index cho dễ đọc)
    const samplePostsData = [
      {
        title: '10 khách sạn được yêu thích nhất tại Đà Nẵng',
        content:
          'Khám phá danh sách 10 khách sạn hàng đầu tại Đà Nẵng, nổi bật với dịch vụ tuyệt vời và vị trí thuận tiện.',
        slug: '10-khach-san-yeu-thich-nhat-tai-da-nang',
        author: users[0],
        city: cities.find((c) => c.title === 'Đà Nẵng') || null,
        imageIndex: 0,
        is_public: true,
      },
      {
        title: 'Bí quyết du lịch tiết kiệm cho sinh viên',
        content:
          'Làm sao để du lịch khắp Việt Nam mà vẫn tiết kiệm chi phí? Bài viết này sẽ chia sẻ những bí quyết hữu ích.',
        slug: 'bi-quyet-du-lich-tiet-kiem-cho-sinh-vien',
        author: users[1] || users[0],
        city: cities.find((c) => c.title === 'Hà Nội') || null,
        imageIndex: 1,
        is_public: true,
      },
      // ... (các bài khác) ...
      {
        title: 'Du lịch Việt Nam mùa nào đẹp nhất?',
        content: 'Gợi ý lịch trình du lịch trong năm để bắt trọn mùa đẹp của từng vùng miền.',
        slug: 'du-lich-viet-nam-mua-nao-dep-nhat',
        author: users[0],
        city: null,
        imageIndex: 2,
        is_public: true,
      },
    ];

    // Nếu bạn muốn seed tất cả như bản gốc, thêm tất cả object vào samplePostsData tương tự.
    // Ở đây ví dụ mình chỉ để một số để ngắn gọn; bạn có thể paste lại toàn bộ danh sách.

    // Clear trước khi seed (nhớ cân nhắc migration/product data khi chạy production)



    // Map sang Partial<Post> với images là mảng object (PostImage)
    const postsToSave: Partial<Post>[] = samplePostsData.map((p) => {
      const imgs = p.imageIndex !== undefined
        ? [sampleImages[p.imageIndex]].filter(Boolean).map((url) => {
            // chú ý: mình giả sử PostImage entity có trường 'url'
            return { url } as unknown as PostImage;
          })
        : [];

      return {
        title: p.title,
        content: p.content,
        slug: p.slug,
        author: p.author,
        city: p.city,
        images: imgs,
        is_public: p.is_public,
      } as Partial<Post>;
    });

    // Save (cascade sẽ tạo PostImage vì relation cascade: true)
    await postRepo.save(postsToSave);

    console.log('✅ PostSeeder completed successfully!');
  }
}
