import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',   // 👈 host MySQL (vd: 127.0.0.1)
  port: Number(process.env.DB_PORT) || 3306,  // 👈 port mặc định của MySQL
  username: process.env.DB_USER || 'root',    // 👈 tài khoản đăng nhập
  password: process.env.DB_PASSWORD || '',    // 👈 mật khẩu (nếu có)
  database: process.env.DB_NAME || 'mydb',    // 👈 tên database
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,   // ⚠️ chỉ bật true khi dev — khi deploy thì nên false
  logging: true,
  timezone: 'Z',       // 👈 đồng bộ timezone (tùy chọn)
  charset: 'utf8mb4',  // 👈 hỗ trợ tiếng Việt & emoji
});
