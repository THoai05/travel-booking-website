import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Notification, NotificationType } from 'src/managements/notifications/entities/notification.entity';
import { User } from 'src/managements/users/entities/users.entity';

export default class NotificationSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const notificationRepository = dataSource.getRepository(Notification);
    const userRepository = dataSource.getRepository(User);

    // Lấy danh sách user từ id 2 -> 21
    const users = await userRepository
      .createQueryBuilder('user')
      .where('user.id BETWEEN :start AND :end', { start: 2, end: 21 })
      .getMany();

    const notificationTypes = [
      NotificationType.BOOKING,
      NotificationType.PAYMENT,
      NotificationType.PROMOTION,
    ];

    const fakeTitles = [
      'Xác nhận đặt phòng',
      'Thanh toán thành công',
      'Ưu đãi siêu hot',
      'Khuyến mãi đặc biệt',
      'Thông báo quan trọng',
    ];

    const fakeMessages = [
      'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!',
      'Đặt phòng của bạn đã được xác nhận.',
      'Thanh toán thành công, chúc bạn kỳ nghỉ vui vẻ.',
      'Bạn nhận được ưu đãi giảm giá 20% cho lần đặt tiếp theo!',
      'Đừng bỏ lỡ những ưu đãi hấp dẫn sắp tới.',
    ];

    const notificationsToSave: Notification[] = [];

    for (const user of users) {
      for (let i = 0; i < 5; i++) {
        const randomTitle = fakeTitles[Math.floor(Math.random() * fakeTitles.length)];
        const randomMessage = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

        const noti = notificationRepository.create({
          user,
          title: randomTitle,
          message: randomMessage,
          type: randomType,
          isRead: false,
        });

        notificationsToSave.push(noti);
      }
    }

    await notificationRepository.save(notificationsToSave);
    console.log(`✅ Đã seed ${notificationsToSave.length} notifications cho ${users.length} users`);
  }
}
