import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  app.use(cookieParser())

  app.use('/avatars', express.static(join(process.cwd(), 'uploads', 'avatars')));
  await app.listen(3636);

}
bootstrap();
