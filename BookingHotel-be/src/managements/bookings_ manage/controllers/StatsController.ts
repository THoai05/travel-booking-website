import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from '../services/StatsService';

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
}