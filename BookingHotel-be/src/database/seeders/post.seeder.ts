import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Post } from 'src/managements/posts/entities/post.entity';
import { User } from 'src/managements/users/entities/users.entity';
import { City } from 'src/managements/city/entities/city.entity';

export default class PostSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const postRepo = dataSource.getRepository(Post);
    const userRepo = dataSource.getRepository(User);
    const cityRepo = dataSource.getRepository(City);

    const users = await userRepo.find();
    const cities = await cityRepo.find();

    if (users.length === 0) {
      console.warn('⚠️  No users found, please seed users first.');
      return;
    }

    const sampleImages = [
      '/uploads/posts/hotel-tips.jpg',
      '/uploads/posts/travel-guide.jpg',
      '/uploads/posts/cuisine.jpg',
    ];

    const samplePosts = [
      {
        title: '10 khách sạn được yêu thích nhất tại Đà Nẵng',
        content:
          'Khám phá danh sách 10 khách sạn hàng đầu tại Đà Nẵng, nổi bật với dịch vụ tuyệt vời và vị trí thuận tiện.',
        slug: '10-khach-san-yeu-thich-nhat-tai-da-nang',
        author: users[0],
        city: cities.find((c) => c.title === 'Đà Nẵng') || null,
        image: sampleImages[0],
        is_public: true,
      },
      {
        title: 'Bí quyết du lịch tiết kiệm cho sinh viên',
        content:
          'Làm sao để du lịch khắp Việt Nam mà vẫn tiết kiệm chi phí? Bài viết này sẽ chia sẻ những bí quyết hữu ích.',
        slug: 'bi-quyet-du-lich-tiet-kiem-cho-sinh-vien',
        author: users[1] || users[0],
        city: cities.find((c) => c.title === 'Hà Nội') || null,
        image: sampleImages[1],
        is_public: true,
      },
      {
        title: 'Top 5 món ăn đặc sản miền Trung nên thử',
        content:
          'Miền Trung Việt Nam nổi tiếng với những món ăn đậm đà, hương vị khó quên. Hãy cùng điểm qua 5 món ngon nhất nhé!',
        slug: 'top-5-mon-an-dac-san-mien-trung-nen-thu',
        author: users[0],
        city: cities.find((c) => c.title === 'Huế') || null,
        image: sampleImages[2],
        is_public: true,
      },
    ];

    await postRepo.clear();

    await postRepo.save(samplePosts);

    console.log('✅ PostSeeder completed successfully!');
  }
}
