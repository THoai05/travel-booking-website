import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  // =================== Serve avatars ===================
  app.use('/avatars', express.static(join(process.cwd(), 'uploads', 'avatars')));
  await app.listen(3636);

}
bootstrap();
