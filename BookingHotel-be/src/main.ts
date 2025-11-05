import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import * as dotenv from "dotenv"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config()

  app.use(helmet());
  app.enableCors({
    origin: 'http://localhost:3000', // URL FE
    credentials: true,
  });

  app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // cho phép frontend load
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Adapter cho Socket.IO
  app.useWebSocketAdapter(new IoAdapter(app));

  app.use(cookieParser());
  await app.listen(3636);
  console.log('Backend running on http://localhost:3636');
}
bootstrap();
