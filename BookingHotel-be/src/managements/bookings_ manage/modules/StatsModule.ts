// src/managements/about/module/stats.module.ts (NEW FILE)

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from '../controllers/StatsController';
import { StatsService } from '../services/StatsService';
import { Booking } from '../../bookings/entities/bookings.entity';
import { Room } from '../../rooms/entities/rooms.entity';

@Module({
    imports: [

        TypeOrmModule.forFeature([Booking, Room]),
    ],
    controllers: [StatsController],
    providers: [StatsService],
    exports: [StatsService, TypeOrmModule.forFeature([Booking, Room])]

})
export class StatsModule { }