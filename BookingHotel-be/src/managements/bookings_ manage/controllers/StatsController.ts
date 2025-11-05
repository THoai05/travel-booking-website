import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from '../services/StatsService';
import { parseISO } from 'date-fns';

@Controller('api/stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('summary')
    getSummary(
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        // Chuyển string ngày thành đối tượng Date
        const startDate = from ? new Date(from) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const endDate = to ? new Date(to) : new Date();

        return this.statsService.getBookingSummary(startDate, endDate);
    }

    @Get('trends-summary')
    getTrendsSummary(
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        const startDate = from ? parseISO(from) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const endDate = to ? parseISO(to) : new Date();

        // Gọi Service để lấy dữ liệu xu hướng
        return this.statsService.getTrendsData(startDate, endDate);
    }
}