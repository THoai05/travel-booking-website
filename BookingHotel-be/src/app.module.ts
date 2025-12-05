import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagementsImports } from './configs/imports.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './configs/database.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './managements/auth/modules/auth.module';
import { UsersModule } from './managements/users/modules/users.module';
import { PostsModule } from './managements/posts/posts.module';
import { CommentsModule } from './managements/comments/comments.module';
import { ResetPasswordModule } from './managements/reset_Password/modules/reset_password.module';
import { FaqModule } from './managements/faq/faq.module';
import { ContactModule } from './managements/contact/module/contact.module';
import { ChatModule } from './managements/chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { InvoiceModule } from './managements/invoice/invoice.module';
import { ZaloChatModule } from './managements/zalo/zalo.module'
import { join } from 'path';
import { PaymentsModule } from './managements/payments/modules/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // prefix truy cập qua URL
    }),

    AuthModule,
    UsersModule,
    ...ManagementsImports,
    TypeOrmModule.forRoot(databaseConfig()),
    PostsModule,
    CommentsModule,
    ResetPasswordModule,
    FaqModule,
    ContactModule,
    PaymentsModule,
    ChatModule,
    InvoiceModule,
    ZaloChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
