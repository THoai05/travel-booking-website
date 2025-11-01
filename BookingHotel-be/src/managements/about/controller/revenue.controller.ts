import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { RevenueService } from '../service/revenue.service';

@Controller('api/revenue')
export class RevenueController {
    constructor(private readonly revenueService: RevenueService) { }

    // ENDPOINT: /api/revenue/summary
    @Get('summary')
    getSummary() {
        // Trả về Summary data (Doanh thu, % tăng trưởng)
        return this.revenueService.getSummaryData();
    }

    // ENDPOINT: /api/revenue/chart-data
    @Get('chart-data')
    getChartData(@Query('period') period: 'month' | 'year') {
        // Trả về data cho biểu đồ
        return this.revenueService.getChartData(period);
    }

    // ENDPOINT: XUẤT PDF BÁO CÁO TỔNG HỢP
    // GET /api/revenue/export/pdf
    @Get('export/pdf')
    async exportPdf(@Res() res: Response) {
        try {
            // 1. Gọi Service tạo Buffer PDF
            const fileBuffer = await this.revenueService.exportRevenuePdf();

            // 2. Thiết lập Header cho PDF
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="bao_cao_doanh_thu_tong_hop.pdf"',
                'Content-Length': fileBuffer.length,
            });

            res.end(fileBuffer);
        } catch (e) {
            console.error("Lỗi xuất PDF:", e);
            res.status(500).send("Lỗi Server khi tạo file PDF");
        }
    }

    // Lưu ý: Endpoint /api/revenue/export/excel đã bị xóa
    // vì logic xuất Excel chi tiết đã chuyển sang BookingController.
}
