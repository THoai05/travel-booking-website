import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../entities/bookings.entity';
import { Repository } from 'typeorm';
import { User } from 'src/managements/users/entities/users.entity';
import { RoomType } from 'src/managements/rooms/entities/roomType.entity';
import { CreateBookingRequest } from '../dtos/req/CreateBookingRequest.dto';
import { UpdateBookingRequest } from '../dtos/req/UpdateBookingRequest.dto';
import { BookingResponseManagement } from '../interfaces/BookingResponseManagement';
import { isValidBooking } from 'src/common/utils/booking-status.utils';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(RoomType)
        private readonly roomTypeRepo:Repository<RoomType>,
    ) { }
    
    async createBooking(body: CreateBookingRequest): Promise<BookingResponseManagement>{
        const {
            checkinDate,
            checkoutDate,
            guestsCount,
            totalPrice,
            userId,
            roomTypeId
        } = body
        
        const user = await this.userRepo.findOne({
            where: {
                id:userId
            }
        })
        if (!user) {
            throw new NotFoundException("Khong tim thay nguoi dung")
        }
        const roomType = await this.roomTypeRepo.findOne({
            where: {
                id:roomTypeId
            }
        })
        if (!roomType) {
            throw new NotFoundException("Khong tim thay loai phong nay")
        }
        const bookingData = await this.bookingRepo.create({
            user,
            roomType,
            checkInDate: checkinDate,
            checkOutDate: checkoutDate,
            guestsCount,
            totalPrice
        })
        const bookingSaved = await this.bookingRepo.save(bookingData)
        return {
            bookingId: bookingSaved.id,
            userId: bookingSaved.user.id,
            roomTypeId: bookingSaved.roomType.id,
            roomTypeName:bookingSaved.roomType.name,
            checkinDate: bookingSaved.checkInDate,
            checkoutDate: bookingSaved.checkOutDate,
            guestsCount: bookingSaved.guestsCount,
            bedType:bookingSaved.roomType.bed_type,
            roomName:bookingSaved.roomType.name,
            totalPrice:bookingSaved.totalPrice
        }
    }



    async updateBookingForGuests(bookingId: number, body: UpdateBookingRequest): Promise<BookingResponseManagement> { // de tam thoi
        const {
            contactFullName,
            contactEmail,
            contactPhone,
            guestsFullName,
            status
        } = body

       const updateBookingData = await this.bookingRepo.findOne({
            where: { id: bookingId },
            relations: ['user', 'roomType', 'roomType.hotel'],
        });

        if (!updateBookingData) {
            throw new NotFoundException("Khong tim thay don hang")
        }

        if (contactFullName !== undefined) {
            updateBookingData.contactFullName = contactFullName
        }

        if (contactEmail !== undefined) {
            updateBookingData.contactEmail = contactEmail
        }

        if (contactPhone !== undefined) {
            updateBookingData.contactPhone = contactPhone
        }

        if (guestsFullName !== undefined) {
            updateBookingData.guestFullName = guestsFullName
        }

        if (status !== undefined) {
            const isValid = isValidBooking(status)
            if (!isValid) {
                throw new BadRequestException("Status khong ton tai")
            }
            updateBookingData.status = status
        }
        
        const updateBookingSaved = await this.bookingRepo.save(updateBookingData)

        //doan nay se return theo interface h tam thoi return nhu nay trc
        return {
            bookingId: updateBookingSaved.id,
            userId: updateBookingSaved.user.id,
            hotelName: updateBookingSaved.roomType.hotel.name,
            hotelAddress: updateBookingSaved.roomType.hotel.name,
            hotelPhone:updateBookingSaved.roomType.hotel.phone,
            roomTypeId: updateBookingSaved.roomType.id,
            roomTypeName:updateBookingData.roomType.name,
            checkinDate: updateBookingSaved.checkInDate,
            checkoutDate: updateBookingSaved.checkOutDate,
            guestsCount: updateBookingSaved.guestsCount,
            bedType:updateBookingSaved.roomType.bed_type,
            roomName:updateBookingSaved.roomType.name,
            totalPrice: updateBookingSaved.totalPrice,
            contactFullName:updateBookingSaved.contactFullName,
            contactEmail:updateBookingSaved.contactEmail,
            contactPhone: updateBookingSaved.contactPhone,
            guestsFullName: updateBookingSaved.guestFullName,
            status:updateBookingSaved.status
        }
    }

    async getFullDataBookingById(id:number):Promise<Booking> {
        const booking = await this.bookingRepo.findOne({
            where: {
                id
            }
        })
        if (!booking) {
            throw new NotFoundException("Khong tim thay don hang")
        }
        return booking
    }

       //Thống kê KPI
    //✅ 1. Thống kê theo tuần: đủ ngày 7 trong tuần
    //✅ 2. Thống kê theo tháng: đủ ngày trong tháng
    //✅ 3. Thống kê theo năm: đủ 12 tháng trong năm
    //✅ 4. Thống kê tổng đặt chỗ
    //✅ 5. Thống kê tổng doanh thu
    //✅ 6. Thống kê tỷ lệ hủy bỏ
    //✅ 7. Thống kê khách hàng mới
    async getKPI(type: 'week' | 'month' | 'year') {
        const now = new Date();

        let startDate: Date;
        let endDate: Date;

        if (type === 'week') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // 7 ngày
            endDate = now;
        } else if (type === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // ngày cuối tháng
        } else { // year
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        }

        // Format ngày sang VN timezone
        const formatVNDate = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7); // UTC+7
            return d.toISOString().split('T')[0];
        }

        // Lấy booking trong khoảng thời gian
        const bookings = await this.bookingRepo.find({
            where: { createdAt: Between(startDate, endDate) },
            relations: ['payment', 'user'],
        });

        const totalBookings = bookings.length;

        const totalRevenue = bookings
            .filter(b => b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS)
            .reduce((sum, b) => sum + Number(b.totalPrice), 0);

        const cancelledCount = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;
        const cancelledRate = totalBookings > 0 ? (cancelledCount / totalBookings) * 100 : 0;

        const bookingsByPeriod: Record<string, { count: number; revenue: number }> = {};

        if (type === 'year') {
            for (let m = 0; m < 12; m++) {
                const monthKey = `${now.getFullYear()}-${(m + 1).toString().padStart(2, '0')}`;
                bookingsByPeriod[monthKey] = { count: 0, revenue: 0 };
            }
            for (const b of bookings) {
                const key = `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
                bookingsByPeriod[key].count++;
                if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                    bookingsByPeriod[key].revenue += Number(b.totalPrice);
                }
            }
        } else { // week hoặc month
            let current = new Date(startDate);
            while (current <= endDate) {
                const dayKey = formatVNDate(current);
                bookingsByPeriod[dayKey] = { count: 0, revenue: 0 };
                current.setDate(current.getDate() + 1);
            }

            for (const b of bookings) {
                const key = formatVNDate(b.createdAt);
                bookingsByPeriod[key].count++;
                if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                    bookingsByPeriod[key].revenue += Number(b.totalPrice);
                }
            }
        }

        // Thống kê doanh thu theo payment method
        const paymentStats = { momo: 0, vnpay: 0, cod: 0 };
        for (const b of bookings) {
            if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                const method = b.payment.paymentMethod.toLowerCase() as keyof typeof paymentStats;
                if (paymentStats[method] !== undefined) {
                    paymentStats[method] += Number(b.totalPrice);
                }
            }
        }

        // Khách hàng mới (distinct user)
        const uniqueUsers = new Set(bookings.map(b => b.user?.id));
        const newCustomers = uniqueUsers.size;

        // Chuyển thành array và sort theo ngày/tháng
        const bookingsByPeriodArray = Object.entries(bookingsByPeriod)
            .map(([date, { count, revenue }]) => ({ date, count, revenue }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
            totalBookings,
            totalRevenue,
            cancelledRate: Number(cancelledRate.toFixed(1)),
            newCustomers,
            paymentStats,
            bookingsByPeriod: bookingsByPeriodArray,
        };
    }


    async getKPIBookingAndCancelledRate(type: 'week' | 'month' | 'year') {
        const now = new Date();
    
        let startDate: Date;
        let endDate: Date;
    
        if (type === 'week') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // 7 ngày
            endDate = now;
        } else if (type === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // cuối tháng
        } else { // year
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        }
    
        const formatVNDate = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7); // UTC+7
            return d.toISOString().split('T')[0];
        };
    
        // Lấy bookings trong khoảng thời gian
        const bookings = await this.bookingRepo.find({
            where: { createdAt: Between(startDate, endDate) },
            relations: ['payment', 'user'],
        });
    
        // --- Tổng lượt đặt phòng ---
        const totalBookings = bookings.length;
        const bookingsLastMonth = await this.bookingRepo.count({
            where: {
                createdAt: Between(
                    new Date(startDate.getFullYear(), startDate.getMonth() - 1, startDate.getDate()),
                    new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate())
                )
            }
        });
        const bookingsChangeRate = bookingsLastMonth
            ? ((totalBookings - bookingsLastMonth) / bookingsLastMonth) * 100
            : 0;
    
        // --- Tổng lượt hủy ---
        const cancelledBookings = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;
        const cancelledLastMonth = await this.bookingRepo.count({
            where: {
                status: BookingStatus.CANCELLED,
                createdAt: Between(
                    new Date(startDate.getFullYear(), startDate.getMonth() - 1, startDate.getDate()),
                    new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate())
                )
            }
        });
        const cancelledChangeRate = cancelledLastMonth
            ? ((cancelledBookings - cancelledLastMonth) / cancelledLastMonth) * 100
            : 0;
    
        // --- Mini chart 10 ngày gần đây ---
        const chartDataMap: Record<string, number> = {};
        for (let i = 9; i >= 0; i--) {
            const day = new Date(now);
            day.setDate(day.getDate() - i);
            chartDataMap[formatVNDate(day)] = 0;
        }
    
        bookings.forEach(b => {
            const key = formatVNDate(b.createdAt);
            if (key in chartDataMap) chartDataMap[key]++;
        });
    
        const bookingsChartData = Object.values(chartDataMap);
    
        // Tương tự cho hủy phòng
        const cancelledChartDataMap: Record<string, number> = {};
        for (let i = 9; i >= 0; i--) {
            const day = new Date(now);
            day.setDate(day.getDate() - i);
            cancelledChartDataMap[formatVNDate(day)] = 0;
        }
        bookings
            .filter(b => b.status === BookingStatus.CANCELLED)
            .forEach(b => {
                const key = formatVNDate(b.createdAt);
                if (key in cancelledChartDataMap) cancelledChartDataMap[key]++;
            });
        const cancelledChartData = Object.values(cancelledChartDataMap);
    
        return {
            bookings: {
                total: totalBookings,
                changeRate: Number(bookingsChangeRate.toFixed(1)),
                chartData: bookingsChartData
            },
            cancelled: {
                total: cancelledBookings,
                changeRate: Number(cancelledChangeRate.toFixed(1)),
                chartData: cancelledChartData
            }
        };
    }


    async getKPIDoanhThu(type: 'week' | 'month' | 'year') {
        const now = new Date();
    
        let startDate: Date;
        let endDate: Date;
    
        if (type === 'week') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // 7 ngày
            endDate = now;
        } else if (type === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // ngày cuối tháng
        } else { // year
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        }
    
        const formatVNDate = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7); // UTC+7
            return d.toISOString().split('T')[0];
        }
    
        const bookings = await this.bookingRepo.find({
            where: { createdAt: Between(startDate, endDate) },
            relations: ['payment', 'user'],
        });
    
        const totalBookings = bookings.length;
        const totalRevenue = bookings
            .filter(b => b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS)
            .reduce((sum, b) => sum + Number(b.totalPrice), 0);
    
        const cancelledCount = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;
        const cancelledRate = totalBookings > 0 ? (cancelledCount / totalBookings) * 100 : 0;
    
        // Khởi tạo đầy đủ khoảng thời gian
        const bookingsByPeriod: Record<string, { count: number; revenue: number }> = {};
    
        if (type === 'year') {
            // 12 tháng
            for (let m = 0; m < 12; m++) {
                const monthKey = `${now.getFullYear()}-${(m + 1).toString().padStart(2, '0')}`;
                bookingsByPeriod[monthKey] = { count: 0, revenue: 0 };
            }
            for (const b of bookings) {
                const key = `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
                bookingsByPeriod[key].count++;
                if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                    bookingsByPeriod[key].revenue += Number(b.totalPrice);
                }
            }
        } else {
            // week hoặc month
            let current = new Date(startDate);
            while (current <= endDate) {
                const dayKey = formatVNDate(current);
                bookingsByPeriod[dayKey] = { count: 0, revenue: 0 }; // tạo đầy đủ ngày
                current.setDate(current.getDate() + 1);
            }
    
            for (const b of bookings) {
                const key = formatVNDate(b.createdAt);
                if (!bookingsByPeriod[key]) bookingsByPeriod[key] = { count: 0, revenue: 0 }; // phòng trường hợp extra
                bookingsByPeriod[key].count++;
                if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                    bookingsByPeriod[key].revenue += Number(b.totalPrice);
                }
            }
        }
    
        // Chuyển thành array và sort theo ngày/tháng
        const bookingsByPeriodArray = Object.entries(bookingsByPeriod)
            .map(([date, { count, revenue }]) => ({ date, count, revenue }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
        // Thống kê doanh thu theo payment method
        const paymentStats: Record<string, number> = { momo: 0, vnpay: 0, cod: 0 };
        for (const b of bookings) {
            if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                const method = b.payment.paymentMethod.toLowerCase();
                if (paymentStats[method] !== undefined) {
                    paymentStats[method] += Number(b.totalPrice);
                }
            }
        }
    
        // Khách hàng mới (distinct user)
        const uniqueUsers = new Set(bookings.map(b => b.user?.id));
        const newCustomers = uniqueUsers.size;
    
        return {
            totalBookings,
            totalRevenue,
            cancelledRate: Number(cancelledRate.toFixed(1)),
            newCustomers,
            paymentStats,
            bookingsByPeriod: bookingsByPeriodArray,
        };
    }
    
    async getRevenueKPI(type: 'week' | 'month' | 'year') {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;
    
        if (type === 'week') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // 7 ngày
          endDate = now;
        } else if (type === 'month') {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // ngày cuối tháng
        } else { // year
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
        }
    
        const formatDateVN = (date: Date) => {
          const d = new Date(date);
          d.setHours(d.getHours() + 7); // UTC+7
          return d.toISOString().split('T')[0];
        }
    
        const bookings = await this.bookingRepo.find({
          where: { createdAt: Between(startDate, endDate) },
          relations: ['payment'],
        });
    
        // Khởi tạo đầy đủ các ngày/tháng
        const revenueByPeriod: Record<string, number> = {};
    
        if (type === 'year') {
          for (let m = 0; m < 12; m++) {
            const monthKey = `${now.getFullYear()}-${(m + 1).toString().padStart(2, '0')}`;
            revenueByPeriod[monthKey] = 0;
          }
          bookings.forEach(b => {
            if (b.payment?.paymentStatus === PaymentStatus.SUCCESS) {
              const key = `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
              revenueByPeriod[key] += Number(b.totalPrice);
            }
          });
        } else { // week hoặc month
          let current = new Date(startDate);
          while (current <= endDate) {
            const dayKey = formatDateVN(current);
            revenueByPeriod[dayKey] = 0;
            current.setDate(current.getDate() + 1);
          }
          bookings.forEach(b => {
            if (b.payment?.paymentStatus === PaymentStatus.SUCCESS) {
              const key = formatDateVN(b.createdAt);
              revenueByPeriod[key] += Number(b.totalPrice);
            }
          });
        }
    
        // Chuyển sang array sorted
        const revenueArray = Object.entries(revenueByPeriod)
          .map(([date, revenue]) => ({ date, revenue }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
        return { type, revenueByPeriod: revenueArray };
      }
    
}
