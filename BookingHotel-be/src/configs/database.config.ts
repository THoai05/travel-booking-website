import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydb',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,   // ⚠️ chỉ bật true khi dev — khi deploy thì nên false
  logging: true,
  timezone: 'Z',       // 👈 đồng bộ timezone (tùy chọn)
  charset: 'utf8mb4',  // 👈 hỗ trợ tiếng Việt & emoji
});
