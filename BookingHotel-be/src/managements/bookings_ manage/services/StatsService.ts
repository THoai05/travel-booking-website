import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../../bookings/entities/bookings.entity';
import { Room } from '../../rooms/entities/rooms.entity'; 

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ) { }

    // Hàm phụ trợ tính % tăng trưởng (đã tối ưu xử lý chia 0)
    private calculatePercentage(current: number, previous: number): string {
        if (previous === 0) return current > 0 ? '+100.0%' : '0%';
        const growth = ((current - previous) / previous) * 100;
        return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    }

    // Hàm phụ trợ tính khoảng ngày đầu/cuối tháng (giữ nguyên)
    private getDateRange(year: number, month: number): { startDate: Date, endDate: Date } {
        const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return { startDate, endDate };
    }

    // Hàm phụ trợ lấy dữ liệu tổng hợp (giữ nguyên)
    private async getAggregatedData(startDate: Date, endDate: Date) {
        const rawStats = await this.bookingRepository.createQueryBuilder('b')
            .select([
                'COUNT(b.id) AS total_count',
                'SUM(CASE WHEN b.status = :completed THEN 1 ELSE 0 END) AS successful_count',
                'SUM(CASE WHEN b.status = :cancelled THEN 1 ELSE 0 END) AS cancelled_count',
                'SUM(b.totalPrice) AS total_revenue',
            ])
            .where('b.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
            .setParameters({
                completed: BookingStatus.COMPLETED,
                cancelled: BookingStatus.CANCELLED
            })
            .getRawOne();

        return {
            totalCount: parseInt(rawStats.total_count || 0, 10),
            successfulCount: parseInt(rawStats.successful_count || 0, 10),
            cancelledCount: parseInt(rawStats.cancelled_count || 0, 10),
            totalRevenue: parseFloat(rawStats.total_revenue || 0),
        };
    }

    // ⭐ HÀM CHÍNH: LẤY TẤT CẢ SỐ LIỆU TỔNG HỢP CHO DASHBOARD
    async getBookingSummary(startDate: Date, endDate: Date): Promise<any> {

        // 1. TÍNH STATS HIỆN TẠI VÀ TRƯỚC ĐÓ
        const diffTime = endDate.getTime() - startDate.getTime();
        const daysCount = Math.ceil(diffTime / (1000 * 3600 * 24));
        const [currentStats, previousStats] = await Promise.all([
            this.getAggregatedData(startDate, endDate),
            this.getAggregatedData(new Date(startDate.getTime() - diffTime), startDate),
        ]);

        // ĐỊNH NGHĨA BIẾN CỤC BỘ ĐỂ FIX LỖI SCOPE TRONG CÔNG THỨC TÍNH TỶ LỆ
        const totalBookings = currentStats.totalCount;
        const totalCancellations = currentStats.cancelledCount;

        // 2. TÍNH OCCUPANCY RATE (Tỉ lệ lấp đầy)
        const rawBookings = await this.bookingRepository.createQueryBuilder('b')
            .select(['b.checkInDate', 'b.checkOutDate'])
            .where('b.status = :completed', { completed: BookingStatus.COMPLETED })
            .andWhere('b.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
            .getMany();

        let totalRoomNightsSold = 0;
        rawBookings.forEach(booking => {
            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);
            const diffTime = checkOut.getTime() - checkIn.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
            totalRoomNightsSold += diffDays;
        });

        const totalRooms = await this.roomRepository.count();
        const totalRoomNightsAvailable = totalRooms * daysCount;

        let occupancyRate = 0;
        if (totalRoomNightsAvailable > 0) {
            occupancyRate = (totalRoomNightsSold / totalRoomNightsAvailable) * 100;
        }

        const changeOccupancy = "+5.1%"; // Giữ mock hoặc cần thêm logic tính Occupancy tháng trước

        // --- Output Final ---
        return {
            // StatsHeader
            totalBookings: totalBookings.toLocaleString(),
            totalCancellations: totalCancellations.toLocaleString(),
            occupancyRate: `${occupancyRate.toFixed(1)}%`, // GIÁ TRỊ TÍNH TOÁN
            changeBookings: this.calculatePercentage(totalBookings, previousStats.totalCount),
            changeCancellations: this.calculatePercentage(totalCancellations, previousStats.cancelledCount),
            changeOccupancy,

            // Ratio Chart Data (Sử dụng các biến đã định nghĩa lại)
            ratioSuccessful: totalBookings > 0 ? (currentStats.successfulCount / totalBookings) * 100 : 0,
            ratioCancelled: totalBookings > 0 ? (totalCancellations / totalBookings) * 100 : 0,

            // Detailed Cards Data
            avgDailyBookings: (totalBookings / (diffTime / (1000 * 3600 * 24))).toFixed(0),
            totalRevenue: currentStats.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        };


    }

    async getTrendsData(startDate: Date, endDate: Date): Promise<any[]> {
        // Dùng DATE_FORMAT và GROUP BY để phân tích data theo tháng
        const trends = await this.bookingRepository.createQueryBuilder('b')
            .select(`DATE_FORMAT(b.created_at, '%Y-%m')`, 'period_key') // Key để sắp xếp
            .addSelect(`DATE_FORMAT(b.created_at, '%b')`, 'month')      // Tên tháng (Ví dụ: Oct, Nov)
            .addSelect(`SUM(CASE WHEN b.status = :completed OR b.status = :confirmed THEN 1 ELSE 0 END)`, 'Bookings')
            .addSelect(`SUM(CASE WHEN b.status = :cancelled THEN 1 ELSE 0 END)`, 'Cancellations')
            .where('b.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
            .setParameters({
                completed: BookingStatus.COMPLETED,
                confirmed: BookingStatus.CONFIRMED, // Thêm CONFIRMED vào tổng số đơn đặt
                cancelled: BookingStatus.CANCELLED
            })
            .groupBy('period_key, month')
            .orderBy('period_key', 'ASC')
            .getRawMany();

        // Chuyển kết quả về dạng số để FE vẽ biểu đồ
        return trends.map(item => ({
            month: item.month,
            Bookings: parseInt(item.Bookings, 10),
            Cancellations: parseInt(item.Cancellations, 10),
        }));
    }
}
