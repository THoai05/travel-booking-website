import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express'; // Cần import Response từ express
import { BookingService } from '../service/booking.service';

@Controller('api/bookings')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    // @Get('list')
    // findAll() {
    //     // Trả về danh sách đã được format cho table ở Frontend
    //     return this.bookingService.findAllBookingsForTable();
    // }

    @Get('list')
    findAll(@Query('search') search?: string) {
        return this.bookingService.findAllBookingsForTable(search);
    }

    // ENDPOINT: XUẤT EXCEL CHI TIẾT ĐẶT PHÒNG
    // GET /api/bookings/export/excel
    @Get('export/excel')
    async exportExcel(@Res() res: Response) {
        try {
            // 1. Gọi Service tạo Buffer Excel
            const fileBuffer = await this.bookingService.exportBookingExcel();

            // 2. Thiết lập Header để trình duyệt tải file
            res.set({
                // MIME Type cho file Excel (.xlsx)
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                // Thiết lập tên file mặc định khi tải
                'Content-Disposition': 'attachment; filename="chi_tiet_dat_phong.xlsx"',
                'Content-Length': fileBuffer.length,
            });

            // 3. Trả về file buffer
            res.end(fileBuffer);
        } catch (e) {
            console.error("Lỗi xuất Excel:", e);
            res.status(500).send("Lỗi Server khi tạo file Excel");
        }
    }
}
