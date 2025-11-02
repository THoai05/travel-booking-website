import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from 'src/managements/bookings/entities/bookings.entity';


@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
    ) { }

    // Hàm phụ trợ tính %
    private calculatePercentage(current: number, previous: number): string {
        if (previous === 0) return current > 0 ? '+100.0%' : '0%';
        const growth = ((current - previous) / previous) * 100;
        return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    }

    //  HÀM CHÍNH: LẤY TẤT CẢ SỐ LIỆU TỔNG HỢP
    async getBookingSummary(startDate: Date, endDate: Date): Promise<any> {

        // 1. TÍNH TOÁN KHOẢNG THỜI GIAN HIỆN TẠI VÀ THÁNG TRƯỚC
        // Tạm thời dùng 30 ngày trước để tính 'last month change' đơn giản
        const thirtyDaysAgo = new Date(startDate);
        thirtyDaysAgo.setDate(startDate.getDate() - 30); // Giả định tính 30 ngày trước

        // 2. QUERY TỔNG HỢP (Hiện tại)
        const currentStats = await this.bookingRepository.createQueryBuilder('b')
            .select([
                'COUNT(b.id) AS total_count', // Tổng số đơn
                'SUM(CASE WHEN b.status = :completed THEN 1 ELSE 0 END) AS successful_count', // Đơn thành công
                'SUM(CASE WHEN b.status = :cancelled THEN 1 ELSE 0 END) AS cancelled_count',   // Đơn bị hủy
                'SUM(b.totalPrice) AS total_revenue', // Tổng doanh thu
            ])
            .where('b.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
            .setParameters({
                completed: BookingStatus.COMPLETED,
                cancelled: BookingStatus.CANCELLED
            })
            .getRawOne();

        // 3. QUERY THÁNG TRƯỚC (Cho phần trăm thay đổi)
        const previousStats = await this.bookingRepository.createQueryBuilder('b')
            .select([
                'COUNT(b.id) AS total_count',
            ])
            .where('b.createdAt BETWEEN :start AND :end', { start: thirtyDaysAgo, end: startDate })
            .getRawOne();


        const totalBookings = parseInt(currentStats.total_count || 0, 10);
        const totalCancellations = parseInt(currentStats.cancelled_count || 0, 10);
        const prevBookings = parseInt(previousStats.total_count || 0, 10);

        // 4. TÍNH TOÁN CHỈ SỐ
        const ratioSuccessful = totalBookings > 0 ? ((totalBookings - totalCancellations) / totalBookings) * 100 : 0;
        const occupancyRate = "87.9%"; // Giả định phức tạp (cần JOIN Room/Hotel), tạm giữ mock structure

        return {
            // HEADER STATS
            totalBookings: totalBookings.toLocaleString(),
            totalCancellations: totalCancellations.toLocaleString(),
            occupancyRate,
            changeBookings: this.calculatePercentage(totalBookings, prevBookings),
            changeCancellations: "-4.2%", // Logic tính hủy phức tạp, tạm giữ mock

            // RATIO CHART
            ratioSuccessful: parseFloat(ratioSuccessful.toFixed(1)),
            ratioCancelled: parseFloat((100 - ratioSuccessful).toFixed(1)),

            // DETAILED CARDS (Cần logic phức tạp hơn)
            avgDailyBookings: (totalBookings / 30).toFixed(0),
            totalRevenue: parseFloat(currentStats.total_revenue || 0).toFixed(2),
        };
    }
}           