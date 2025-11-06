import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Review, ReviewType } from '../../managements/reviews/entities/review.entity';
import { User } from '../../managements/users/entities/users.entity';
import { Hotel } from '../../managements/hotels/entities/hotel.entity';

export default class ReviewSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const reviewRepo = dataSource.getRepository(Review);
    const userRepo = dataSource.getRepository(User);
    const hotelRepo = dataSource.getRepository(Hotel);

    const users = (await userRepo.find()).filter((u) => u.id !== 1);
    const hotels = await hotelRepo.find();

    if (!users.length || !hotels.length) {
      console.log('❌ Không có user hoặc hotel để seed reviews');
      return;
    }

    const fakeComments = [
      'Phòng sạch sẽ, nhân viên thân thiện.',
      'Khách sạn hơi ồn nhưng vị trí đẹp.',
      'Giá tốt, dịch vụ ổn định.',
      'Tôi sẽ quay lại lần sau!',
      'Phòng hơi nhỏ nhưng tiện nghi.',
      'Nhân viên hỗ trợ rất tốt.',
      'Bữa sáng ngon miệng, đa dạng.',
      'Gần trung tâm, thuận tiện di chuyển.',
      'View đẹp, không gian yên tĩnh.',
      'Dịch vụ khá ổn so với giá tiền.'
    ];

    const fakeImages = [
      null,
      '/uploads/review1.jpg',
      '/uploads/review2.jpg',
      '/uploads/review3.jpg',
      '/uploads/review4.jpg',
      null,
      null
    ];

    const totalReviews = 1500;
    const reviews: Partial<Review>[] = [];

    for (let i = 0; i < totalReviews; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
      const randomRating = Math.floor(Math.random() * 5) + 1;
      const randomComment = fakeComments[Math.floor(Math.random() * fakeComments.length)];
      const randomType = Math.random() > 0.5 ? ReviewType.HOTEL : ReviewType.ROOM;
      const randomImage = fakeImages[Math.floor(Math.random() * fakeImages.length)];

      reviews.push({
        user: randomUser,
        hotel: randomHotel,
        rating: randomRating,
        comment: randomComment,
        reviewType: randomType,
        images: randomImage ? [randomImage] : null,
      });
    }

    await reviewRepo.save(reviews);
    console.log(`✅ Seeded ${totalReviews} review records thành công!`);
  }
}
