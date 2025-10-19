import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagementsImports } from './configs/imports.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './configs/database.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './managements/auth/modules/auth.module';
import { UsersModule } from './managements/users/modules/users.module';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal:true
  }),
  AuthModule,  
  UsersModule,
  ...ManagementsImports,
  TypeOrmModule.forRoot(databaseConfig())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
