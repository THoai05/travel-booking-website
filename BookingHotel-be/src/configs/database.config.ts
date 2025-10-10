import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: process.env.DB_SERVER,     // ✅ TypeORM hỗ trợ host
  port: 1433,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,
  cache: true,
  extra: {                         // 👈 truyền cấu hình riêng cho driver tedious
    trustServerCertificate: true,
    encrypt: false,
    server: process.env.DB_SERVER, // ✅ đây là cái mà tedious cần
  },
});
