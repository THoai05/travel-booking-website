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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  dotenv.config()

  app.use(helmet());
  app.enableCors({
    origin: 'http://localhost:3000', // URL FE
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
    setHeaders: (res, path, stat) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });



  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Adapter cho Socket.IO
  app.useWebSocketAdapter(new IoAdapter(app));

  app.use(cookieParser());
  await app.listen(3636);
  console.log('✅ Backend running on http://localhost:3636');
  console.log('✅ Uploads served from http://localhost:3636/uploads');
}
bootstrap();
