import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloChat } from './entities/zalo.entity';
import { ZaloService } from './zalo.service';
import { ZaloController } from './zalo.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ZaloChat]),
    ],
    controllers: [ZaloController],
    providers: [ZaloService],
    exports: [ZaloService],
})
export class ZaloModule { }
