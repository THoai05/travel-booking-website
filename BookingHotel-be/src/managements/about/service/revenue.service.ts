import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from 'src/managements/bookings/entities/bookings.entity';
// Cần cài đặt npm install pdfkit
const PDFDocument = require('pdfkit');

@Injectable()
export class RevenueService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
    ) { }

    // Logic tính toán phần trăm 
    private calculatePercentage(current: number, previous: number): string {
        if (previous === 0) return current > 0 ? '+100.0%' : '0%';
        const growth = ((current - previous) / previous) * 100;
        return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    }

    // Logic lấy khoảng ngày 
    private getDateRange(year: number, month: number): { startDate: Date, endDate: Date } {
        const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return { startDate, endDate };
    }

    // Hàm phụ trợ lấy dữ liệu tổng hợp 
    private async getAggregatedData(year: number, month: number): Promise<{ totalRevenue: number; totalBookings: number }> {
        const range = this.getDateRange(year, month);
        const result = await this.bookingRepository.createQueryBuilder('b')
            .select('COUNT(b.id)', 'totalBookings')
            .addSelect('SUM(b.totalPrice)', 'totalRevenue')
            .where('b.status = :status', { status: BookingStatus.COMPLETED })
            .andWhere('b.createdAt BETWEEN :startDate AND :endDate', {
                startDate: range.startDate,
                endDate: range.endDate
            })
            .getRawOne();

        const totalRevenue = parseFloat(result?.totalRevenue || '0');
        const totalBookings = parseInt(result?.totalBookings || '0', 10);
        return { totalRevenue, totalBookings };
    }

    // 1. LOGIC CHO OVERVIEW CARDS 
    async getSummaryData(): Promise<any> {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousYear = previousDate.getFullYear();
        const previousMonth = previousDate.getMonth() + 1;

        const [currentData, previousData] = await Promise.all([
            this.getAggregatedData(currentYear, currentMonth),
            this.getAggregatedData(previousYear, previousMonth),
        ]);

        const revenueChange = this.calculatePercentage(currentData.totalRevenue, previousData.totalRevenue);
        const bookingsChange = this.calculatePercentage(currentData.totalBookings, previousData.totalBookings);

        return {
            totalRevenue: currentData.totalRevenue,
            totalBookings: currentData.totalBookings,
            revenueDisplay: currentData.totalRevenue.toLocaleString('vi-VN') + '₫',
            revenueChange: revenueChange,
            bookingsChange: bookingsChange,
            newCustomers: 324,
            growthRate: revenueChange,
        };
    }

    // 2. LOGIC CHO REVENUE CHART 
    async getChartData(period: 'month' | 'year' = 'month'): Promise<any[]> {
        const format = (period === 'month') ? '%Y-%m' : '%Y';
        const labelFormat = (period === 'month') ? 'Th%m' : '%Y';
        const currentYear = new Date().getFullYear();

        const chartData = await this.bookingRepository.createQueryBuilder('b')
            .select(`DATE_FORMAT(b.created_at, '${format}')`, 'period_key')
            .addSelect(`DATE_FORMAT(b.created_at, '${labelFormat}')`, 'month')
            .addSelect('SUM(b.totalPrice)', 'revenue')
            .where('b.status = :status', { status: BookingStatus.COMPLETED })
            .andWhere(period === 'month' ? `YEAR(b.created_at) = ${currentYear}` : '1=1')
            .groupBy('period_key')
            .addGroupBy('month')
            .orderBy('period_key', 'ASC')
            .getRawMany();

        return chartData.map(item => ({
            month: item.month,
            revenue: parseFloat(item.revenue) / 1000000,
        }));
    }


    // 3. LOGIC XUẤT PDF BÁO CÁO TỔNG HỢP 
    async exportRevenuePdf(): Promise<Buffer> {
        const summary = await this.getSummaryData();
        const chartData = await this.getChartData('month');

        // Đường dẫn tới file font đã được tải 
        const fontPath = process.cwd() + '/src/assets/fonts/Roboto-Regular.ttf';

        return new Promise(resolve => {
            // Khởi tạo PDF
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            
            doc.font(fontPath);
            // -----------------------------

            doc.fontSize(16).text('BÁO CÁO TỔNG HỢP DOANH THU THÁNG', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12).text(`- TỔNG DOANH THU THÁNG: ${summary.revenueDisplay} (${summary.revenueChange})`);
            doc.text(`- TĂNG TRƯỞNG DOANH THU: ${summary.revenueChange}`);
            doc.text(`- TỔNG SỐ ĐƠN ĐẶT PHÒNG: ${summary.totalBookings} (${summary.bookingsChange})`);
            doc.moveDown();

            doc.fontSize(14).text('CHI TIẾT DOANH THU THEO THÁNG:', { underline: true });

            let yPos = doc.y + 10;
            chartData.forEach(item => {
                doc.text(`${item.month}: ${item.revenue.toFixed(2)} Triệu VNĐ`, 50, yPos);
                yPos += 20;
            });

            doc.end();
        });
    }
}