import { Controller, Get, Res, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { BookingService } from '../service/booking.service';

@Controller('api/bookings')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Get('list')
    findAll(
        // NestJS Pipes giúp parse và đặt giá trị mặc định:
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('search') search?: string,
    ) {
        //  Truyền đủ 3 tham số (page, limit, search) xuống Service
        return this.bookingService.findAllBookingsForTable(page, limit, search);
    }

    // ENDPOINT: XUẤT EXCEL CHI TIẾT ĐẶT PHÒNG
    // GET /api/bookings/export/excel?search=xyz
    @Get('export/excel')
    async exportExcel(@Res() res: Response, @Query('search') search?: string) {
        try {
            // 1. Gọi Service tạo Buffer Excel (có truyền tham số search)
            const fileBuffer = await this.bookingService.exportBookingExcel(search);

            // 2. Thiết lập Header để trình duyệt tải file
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="chi_tiet_dat_phong.xlsx"',
                'Content-Length': fileBuffer.length,
            });

            // 3. Trả về file buffer
            res.end(fileBuffer);
        } catch (e) {
            console.error("Lỗi xuất Excel:", e);
            // Cần return res.status(500).send("...") khi sử dụng @Res()
            return res.status(500).send("Lỗi Server khi tạo file Excel");
        }
    }
}