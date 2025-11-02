// src/managements/about/module/stats.module.ts (NEW FILE)

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from '../controllers/StatsController';
import { StatsService } from '../services/StatsService';
import { Booking } from '../../bookings/entities/bookings.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking]),
    ],
    controllers: [StatsController],
    providers: [StatsService],
    exports: [StatsService]
})
export class StatsModule { }