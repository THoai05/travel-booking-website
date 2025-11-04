import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser'
import * as dotenv from "dotenv"

async function bootstrap() {
  // ép kiểu về NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  dotenv.config()

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // serve static files (ảnh, uploads, v.v.)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.use(cookieParser())

  app.use('/avatars', express.static(join(process.cwd(), 'uploads', 'avatars')));

  await app.listen(3636);
}
bootstrap();
