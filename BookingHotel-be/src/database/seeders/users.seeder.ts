import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User, UserRole, Gender, MembershipLevel } from '../../managements/users/entities/users.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) {
      console.log('✅ Users already seeded');
      return;
    }

    const adminPassword = await bcrypt.hash('12345678', 10);
    const customerPassword = await bcrypt.hash('12345678', 10);

    const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
    const memberships = [
      MembershipLevel.SILVER,
      MembershipLevel.GOLD,
      MembershipLevel.PLATINUM,
    ];

    const users: Partial<User>[] = [];

    // 👉 Admin (record đầu tiên)
    const adminLastLogin = new Date();
    adminLastLogin.setDate(adminLastLogin.getDate() + Math.floor(Math.random() * 2));
    users.push({
      username: 'admin',
      password: adminPassword,
      fullName: 'Admin System',
      email: 'admin@example.com',
      phone: '0123456789',
      role: UserRole.ADMIN,
      gender: Gender.MALE,
      loyaltyPoints: 1000,
      membershipLevel: MembershipLevel.PLATINUM,
      lastLogin: adminLastLogin,
    });

    // 👉 20 users ngẫu nhiên với createdAt & updatedAt nằm trong 10 ngày gần đây
    const today = new Date();

    // Đảm bảo 10 ngày qua mỗi ngày có ít nhất 1 user
    const createdDates: Date[] = [];
    for (let d = 0; d < 10; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      createdDates.push(date);
    }

    // 10 user đầu tiên mỗi ngày một user
    const firstTenUsersDates = [...createdDates];

    // 10 user còn lại random trong 10 ngày gần đây
    const remainingTenUsersDates = Array.from({ length: 10 }, () => {
      const randomIndex = Math.floor(Math.random() * createdDates.length);
      return createdDates[randomIndex];
    });

    // Tổng hợp 20 ngày tạo cho 20 user
    const allDates = [...firstTenUsersDates, ...remainingTenUsersDates];

    for (let i = 1; i <= 20; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const membership = memberships[Math.floor(Math.random() * memberships.length)];
      const username = `user${i}`;
      const fullName = `Customer ${i}`;
      const email = `user${i}@example.com`;
      const phone = `09${Math.floor(10000000 + Math.random() * 89999999)}`;

      const createdAt = new Date(allDates[i - 1]);
      const updatedAt = new Date(createdAt);
      updatedAt.setDate(createdAt.getDate() + Math.floor(Math.random() * 3)); // updated >= created, lệch tối đa 2 ngày

      const lastLogin = new Date(createdAt);
      lastLogin.setDate(createdAt.getDate() + Math.floor(Math.random() * 3)); // lastLogin >= createdAt, lệch tối đa 2 ngày

      users.push({
        username,
        password: customerPassword,
        fullName,
        email,
        phone,
        role: UserRole.CUSTOMER,
        gender,
        loyaltyPoints: Math.floor(Math.random() * 1000),
        membershipLevel: membership,
        createdAt,
        updatedAt,
        lastLogin,
      });
    }

    // 👉 Thêm 10 user mới (giữ nguyên như cũ, không cần ngày random)
    const recentUsers: Partial<User>[] = [];
    for (let i = 21; i <= 30; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const membership = memberships[Math.floor(Math.random() * memberships.length)];
      const username = `user${i}`;
      const fullName = `Customer ${i}`;
      const email = `user${i}@example.com`;
      const phone = `09${Math.floor(10000000 + Math.random() * 89999999)}`;

      const createdAt = new Date(today);
      const randomDaysAgo = Math.floor(Math.random() * 10);
      createdAt.setDate(today.getDate() - randomDaysAgo);

      const updatedAt = new Date(createdAt);
      updatedAt.setDate(createdAt.getDate() + Math.floor(Math.random() * 3));

      const lastLogin = new Date(createdAt);
      lastLogin.setDate(createdAt.getDate() + Math.floor(Math.random() * 3));

      recentUsers.push({
        username,
        password: customerPassword,
        fullName,
        email,
        phone,
        role: UserRole.CUSTOMER,
        gender,
        loyaltyPoints: Math.floor(Math.random() * 1000),
        membershipLevel: membership,
        createdAt,
        updatedAt,
        lastLogin,
      });
    }

    users.push(...recentUsers);

    await userRepository.save(users);
    console.log(`🌱 Seeded ${users.length} users (1 admin + 20 random with dates + 10 extra recent) successfully`);
  }
}
