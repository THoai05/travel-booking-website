import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',                                            // 👈 đổi MSSQL → MySQL
  host: process.env.DB_HOST || 'localhost',                 // 👈 host của MySQL
  port: Number(process.env.DB_PORT) || 3306,                // 👈 port mặc định MySQL
  username: process.env.DB_USER || 'root',                  // 👈 tài khoản đăng nhập
  password: process.env.DB_PASSWORD || '',                  // 👈 mật khẩu (nếu có)
  database: process.env.DB_NAME || 'mydb',                  // 👈 tên database
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,                                        // ⚠️ chỉ bật khi dev
  logging: true,
  charset: 'utf8mb4',                                       // 👈 hỗ trợ tiếng Việt & emoji
  timezone: 'Z',                                            // 👈 optional: đồng bộ timezone
});
