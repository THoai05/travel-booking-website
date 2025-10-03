import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';  // <-- import UsersModule
import { PasswordResetsModule } from './password-resets/password-resets.module'; // <-- import PasswordResetsModule

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
	  
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') ?? 'localhost',
        port: parseInt(config.get<string>('DB_PORT') ?? '3306', 10),
        username: config.get<string>('DB_USER') ?? 'root',
        password: config.get<string>('DB_PASS') ?? '',
        database: config.get<string>('DB_NAME') ?? 'booking_hotel',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
	UsersModule,  // <-- thêm vào đây UsersModule
	PasswordResetsModule, // <-- thêm vào đây PasswordResetsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
