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
    });

    // 👉 20 users ngẫu nhiên (giữ nguyên logic cũ)
    for (let i = 1; i <= 20; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const membership = memberships[Math.floor(Math.random() * memberships.length)];
      const username = `user${i}`;
      const fullName = `Customer ${i}`;
      const email = `user${i}@example.com`;
      const phone = `09${Math.floor(10000000 + Math.random() * 89999999)}`;

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
      });
    }

    // 👉 10 user mới có created_at và updated_at random trong 10 ngày gần đây
    const today = new Date();

    for (let i = 21; i <= 30; i++) {
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const membership = memberships[Math.floor(Math.random() * memberships.length)];
      const username = `user${i}`;
      const fullName = `Customer ${i}`;
      const email = `user${i}@example.com`;
      const phone = `09${Math.floor(10000000 + Math.random() * 89999999)}`;

      // Random ngày createdAt trong 10 ngày gần đây (từ hôm nay lùi về tối đa 9 ngày)
      const createdAt = new Date(today);
      const randomDaysAgo = Math.floor(Math.random() * 10); // 0 - 9 ngày
      createdAt.setDate(today.getDate() - randomDaysAgo);

      // updated_at luôn >= created_at
      const updatedAt = new Date(createdAt);
      const randomUpdateOffset = Math.floor(Math.random() * 3); // 0 - 2 ngày sau
      updatedAt.setDate(createdAt.getDate() + randomUpdateOffset);

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
      });
    }

    await userRepository.save(users);
    console.log(`🌱 Seeded ${users.length} users (1 admin + 20 default + 10 recent random date users) successfully`);
  }
}
