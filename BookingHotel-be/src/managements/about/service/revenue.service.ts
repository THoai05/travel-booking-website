import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';
import { BookingService } from './booking.service'; // <-- Đã sửa đường dẫn Booking Service

// Cần import pdfkit (npm install pdfkit)
const PDFDocument = require('pdfkit');

@Injectable()
export class RevenueService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        // Inject BookingService để dùng logic lấy data chi tiết (tính %)
        private readonly bookingService: BookingService,
    ) { }

    // Hàm phụ trợ tính % tăng trưởng (giữ nguyên)
    private calculatePercentage(current: number, previous: number): string {
        // ... (Logic tính % giữ nguyên) ...
        if (previous === 0) return current > 0 ? '+100%' : '0%';
        const change = ((current - previous) / previous) * 100;
        return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    }

    // Logic getSummaryData (giữ nguyên)
    async getSummaryData(): Promise<any> {
        // ... (Logic tính toán giữ nguyên) ...
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        const [currentData, previousData] = await Promise.all([
            this.bookingRepository.createQueryBuilder('b')
                .select('COUNT(b.id)', 'totalBookings')
                .addSelect('SUM(b.totalPrice)', 'totalRevenue')
                .where('b.status = :status', { status: 'completed' })
                .andWhere('YEAR(b.created_at) = :year', { year: currentYear })
                .andWhere('MONTH(b.created_at) = :month', { month: currentMonth })
                .getRawOne(),
            this.bookingRepository.createQueryBuilder('b')
                .select('COUNT(b.id)', 'totalBookings')
                .addSelect('SUM(b.totalPrice)', 'totalRevenue')
                .where('b.status = :status', { status: 'completed' })
                .andWhere('YEAR(b.created_at) = :year', { year: prevYear })
                .andWhere('MONTH(b.created_at) = :month', { month: prevMonth })
                .getRawOne(),
        ]);

        const currentRevenue = parseFloat(currentData?.totalRevenue || 0);
        const prevRevenue = parseFloat(previousData?.totalRevenue || 0);
        const currentBookings = parseInt(currentData?.totalBookings || 0, 10);
        const prevBookings = parseInt(previousData?.totalBookings || 0, 10);

        return {
            totalRevenue: currentRevenue,
            totalBookings: currentBookings,
            revenueDisplay: currentRevenue.toLocaleString('vi-VN') + '₫',
            revenueChange: this.calculatePercentage(currentRevenue, prevRevenue),
            bookingsChange: this.calculatePercentage(currentBookings, prevBookings),
            newCustomers: 324,
            growthRate: "+18.2%",
        };
    }

    // Logic getChartData (giữ nguyên)
    async getChartData(period: 'month' | 'year' = 'month'): Promise<any[]> {
        // ... (Logic giữ nguyên) ...
        const format = (period === 'month') ? '%Y-%m' : '%Y';
        const labelFormat = (period === 'month') ? 'Th%m' : '%Y';

        const chartData = await this.bookingRepository.createQueryBuilder('b')
            .select(`DATE_FORMAT(b.created_at, '${format}')`, 'period_key')
            .addSelect(`DATE_FORMAT(b.created_at, '${labelFormat}')`, 'month')
            .addSelect('SUM(b.totalPrice)', 'revenue')
            .where('b.status = :status', { status: 'completed' })
            .groupBy('period_key')
            .addGroupBy('month')
            .orderBy('period_key', 'ASC')
            .getRawMany();

        return chartData.map(item => ({
            month: item.month,
            revenue: parseFloat(item.revenue) / 1000000,
        }));
    }

    // Logic exportRevenuePdf (giữ nguyên)
    async exportRevenuePdf(): Promise<Buffer> {
        // ... (Logic giữ nguyên) ...
        const summary = await this.getSummaryData();
        const chartData = await this.getChartData('month');

        return new Promise(resolve => {
            // ... (Code PDFDocument giữ nguyên) ...
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            doc.fontSize(16).text('BÁO CÁO TỔNG HỢP DOANH THU THÁNG', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12).text(`- TỔNG DOANH THU THÁNG: ${summary.revenueDisplay}`);
            doc.text(`- TĂNG TRƯỞNG DOANH THU: ${summary.revenueChange}`);
            doc.text(`- TỔNG SỐ ĐƠN ĐẶT PHÒNG: ${summary.totalBookings}`);
            doc.moveDown();

            doc.fontSize(14).text('CHI TIẾT DOANH THU THEO THÁNG:', { underline: true });

            let yPos = doc.y + 10;
            chartData.forEach(item => {
                doc.text(`${item.month}: ${item.revenue} Triệu VNĐ`, 50, yPos);
                yPos += 20;
            });

            doc.end();
        });
    }
}
