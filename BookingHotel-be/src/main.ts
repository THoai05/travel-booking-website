import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' });
  app.useGlobalPipes(new ValidationPipe({ //Bật ValidationPipe
    whitelist: true,           // loại bỏ thuộc tính không có trong DTO
    forbidNonWhitelisted: true // báo lỗi nếu gửi thuộc tính lạ
  }));
  await app.listen(8080);
}
bootstrap();

