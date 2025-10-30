// src/revenue/revenue.module.ts
import { Module } from '@nestjs/common';
import { RevenueService } from '../service/revenue.service';
import { RevenueController } from '../controller/revenue.controller';
import { BookingModuleAbout } from '../module/booking.module'; // Import để lấy BookingService

@Module({
    imports: [
        BookingModuleAbout // Cung cấp TypeORM Repository và BookingService
    ],
    controllers: [RevenueController],
    providers: [RevenueService],
})
export class RevenueModule { }