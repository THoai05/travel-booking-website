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
        content: 'Khám phá danh sách 10 khách sạn hàng đầu tại Đà Nẵng, nổi bật với dịch vụ tuyệt vời và vị trí thuận tiện.',
        slug: '10-khach-san-yeu-thich-nhat-tai-da-nang',
        author: users[0],
        city: cities.find((c) => c.title === 'Đà Nẵng') || null,
        image: sampleImages[0],
        is_public: true,
      },
      {
        title: 'Bí quyết du lịch tiết kiệm cho sinh viên',
        content: 'Làm sao để du lịch khắp Việt Nam mà vẫn tiết kiệm chi phí? Bài viết này sẽ chia sẻ những bí quyết hữu ích.',
        slug: 'bi-quyet-du-lich-tiet-kiem-cho-sinh-vien',
        author: users[1] || users[0],
        city: cities.find((c) => c.title === 'Hà Nội') || null,
        image: sampleImages[1],
        is_public: true,
      },
      {
        title: 'Top 5 món ăn đặc sản miền Trung nên thử',
        content: 'Miền Trung Việt Nam nổi tiếng với những món ăn đậm đà, hương vị khó quên. Hãy cùng điểm qua 5 món ngon nhất nhé!',
        slug: 'top-5-mon-an-dac-san-mien-trung-nen-thu',
        author: users[0],
        city: cities.find((c) => c.title === 'Huế') || null,
        image: sampleImages[2],
        is_public: true,
      },
      {
        title: 'Những điểm sống ảo hot nhất tại Sài Gòn',
        content: 'Tổng hợp những địa điểm check-in sang xịn mịn dành cho các bạn trẻ tại TP. Hồ Chí Minh.',
        slug: 'nhung-diem-song-ao-hot-nhat-tai-sai-gon',
        author: users[0],
        city: cities.find((c) => c.title === 'Hồ Chí Minh') || null,
        image: sampleImages[0],
        is_public: true,
      },
      {
        title: 'Hướng dẫn đặt phòng khách sạn online an toàn',
        content: 'Đặt phòng online giúp tiết kiệm thời gian nhưng cũng tiềm ẩn rủi ro. Đây là những mẹo giúp bạn đặt phòng an toàn.',
        slug: 'huong-dan-dat-phong-khach-san-online-an-toan',
        author: users[1] || users[0],
        city: null,
        image: sampleImages[1],
        is_public: true,
      },
      {
        title: 'Top 7 bãi biển đẹp nhất miền Trung',
        content: 'Biển miền Trung mang vẻ đẹp hoang sơ và quyến rũ. Đừng bỏ lỡ 7 địa điểm sau!',
        slug: 'top-7-bai-bien-dep-nhat-mien-trung',
        author: users[0],
        city: cities.find((c) => c.title === 'Đà Nẵng') || null,
        image: sampleImages[2],
        is_public: true,
      },
      {
        title: 'Du lịch tự túc hay tour trọn gói? Nên chọn cái nào?',
        content: 'So sánh ưu và nhược của hai hình thức du lịch phổ biến nhất hiện nay.',
        slug: 'du-lich-tu-tuc-hay-tour-tron-goi',
        author: users[1] || users[0],
        city: null,
        image: sampleImages[0],
        is_public: true,
      },
      {
        title: 'Khám phá ẩm thực đường phố Hà Nội',
        content: 'Những món ăn vỉa hè Hà Nội gây thương nhớ cho bất kỳ ai từng thưởng thức.',
        slug: 'kham-pha-am-thuc-duong-pho-ha-noi',
        author: users[0],
        city: cities.find((c) => c.title === 'Hà Nội') || null,
        image: sampleImages[1],
        is_public: true,
      },
      {
        title: '5 điểm săn mây đẹp nhất Đà Lạt',
        content: 'Đà Lạt luôn khiến du khách mê mẩn với vẻ đẹp bồng bềnh trên mây.',
        slug: '5-diem-san-may-dep-nhat-da-lat',
        author: users[0],
        city: cities.find((c) => c.title === 'Đà Lạt') || null,
        image: sampleImages[2],
        is_public: true,
      },
      {
        title: 'Du lịch Nha Trang: Những điều cần lưu ý',
        content: 'Bật mí những tips quan trọng để có chuyến đi Nha Trang trọn vẹn.',
        slug: 'du-lich-nha-trang-nhung-dieu-can-luu-y',
        author: users[1] || users[0],
        city: cities.find((c) => c.title === 'Nha Trang') || null,
        image: sampleImages[0],
        is_public: true,
      },
      {
        title: 'Khám phá Chợ Bến Thành chuẩn dân du lịch',
        content: 'Chợ Bến Thành là biểu tượng lịch sử và văn hoá không thể bỏ qua của Sài Gòn.',
        slug: 'kham-pha-cho-ben-thanh',
        author: users[0],
        city: cities.find((c) => c.title === 'Hồ Chí Minh') || null,
        image: sampleImages[1],
        is_public: true,
      },
      {
        title: 'Review top 3 homestay giá rẻ ở Đà Nẵng',
        content: 'Giới thiệu những homestay đẹp – rẻ – chất thích hợp cho nhóm bạn.',
        slug: 'review-top-3-homestay-gia-re-da-nang',
        author: users[1] || users[0],
        city: cities.find((c) => c.title === 'Đà Nẵng') || null,
        image: sampleImages[2],
        is_public: true,
      },
      {
        title: 'Cần Thơ gạo trắng nước trong – có gì chơi?',
        content: 'Du lịch miền Tây và khám phá vẻ đẹp bình dị của Cần Thơ.',
        slug: 'can-tho-co-gi-choi',
        author: users[0],
        city: cities.find((c) => c.title === 'Cần Thơ') || null,
        image: sampleImages[0],
        is_public: true,
      },
      {
        title: 'Hải Phòng – Thành phố hoa phượng đỏ có gì hấp dẫn?',
        content: 'Từ đặc sản bánh đa cua đến biển Đồ Sơn – Hải Phòng luôn khiến du khách bất ngờ.',
        slug: 'hai-phong-thanh-pho-hoa-phuong-do',
        author: users[1] || users[0],
        city: cities.find((c) => c.title === 'Hải Phòng') || null,
        image: sampleImages[1],
        is_public: true,
      },
      {
        title: 'Du lịch Việt Nam mùa nào đẹp nhất?',
        content: 'Gợi ý lịch trình du lịch trong năm để bắt trọn mùa đẹp của từng vùng miền.',
        slug: 'du-lich-viet-nam-mua-nao-dep-nhat',
        author: users[0],
        city: null,
        image: sampleImages[2],
        is_public: true,
      },
    ];

    await postRepo.clear();

    await postRepo.save(samplePosts);

    console.log('✅ PostSeeder completed successfully!');
  }
}
