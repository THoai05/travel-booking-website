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
import { Between, In } from 'typeorm';
import { BookingStatus } from '../entities/bookings.entity';
import { PaymentStatus, PaymentMethod } from 'src/managements/payments/entities/payments.entity';
import { RatePlan } from 'src/managements/rooms/entities/ratePlans.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(RoomType)
        private readonly roomTypeRepo: Repository<RoomType>,
        @InjectRepository(RatePlan)
        private readonly ratePlanRepo: Repository<RatePlan>
    ) { }

    async createBooking(body: CreateBookingRequest): Promise<BookingResponseManagement> {
        const {
            checkinDate,
            checkoutDate,
            guestsCount,
            totalPrice,
            userId,
            roomTypeId,
            ratePlanId
        } = body

        console.log(body)

        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new NotFoundException("Khong tim thay nguoi dung")
        }
        const roomType = await this.roomTypeRepo.findOne({
            where: {
                id: roomTypeId
            }
        })
        if (!roomType) {
            throw new NotFoundException("Khong tim thay loai phong nay")
        }
        const ratePlan = await this.ratePlanRepo.findOne({
            where: {
                id: ratePlanId
            }
        })
        if (!ratePlan) {
            throw new NotFoundException("Khong tim thay kieu phong nay")
        }
        const bookingData = await this.bookingRepo.create({
            user,
            roomType,
            checkInDate: checkinDate,
            checkOutDate: checkoutDate,
            guestsCount,
            totalPrice,
            rateplan: ratePlan
        })
        const bookingSaved = await this.bookingRepo.save(bookingData)
        return {
            bookingId: bookingSaved.id,
            userId: bookingSaved.user.id,
            roomTypeId: bookingSaved.roomType.id,
            roomTypeName: bookingSaved.roomType.name,
            checkinDate: bookingSaved.checkInDate,
            checkoutDate: bookingSaved.checkOutDate,
            guestsCount: bookingSaved.guestsCount,
            bedType: bookingSaved.roomType.bed_type,
            roomName: bookingSaved.roomType.name,
            totalPrice: bookingSaved.totalPrice
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
            hotelPhone: updateBookingSaved.roomType.hotel.phone,
            roomTypeId: updateBookingSaved.roomType.id,
            roomTypeName: updateBookingData.roomType.name,
            checkinDate: updateBookingSaved.checkInDate,
            checkoutDate: updateBookingSaved.checkOutDate,
            guestsCount: updateBookingSaved.guestsCount,
            bedType: updateBookingSaved.roomType.bed_type,
            roomName: updateBookingSaved.roomType.name,
            totalPrice: updateBookingSaved.totalPrice,
            contactFullName: updateBookingSaved.contactFullName,
            contactEmail: updateBookingSaved.contactEmail,
            contactPhone: updateBookingSaved.contactPhone,
            guestsFullName: updateBookingSaved.guestFullName,
            status: updateBookingSaved.status
        }
    }

    async getFullDataBookingById(id: number): Promise<Booking> {
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


    async getKPIAll(type: 'week' | 'month' | 'year') {
        const now = new Date();
    
        // --- Khoảng thời gian hiện tại ---
        let startDate: Date;
        let endDate: Date;
    
        if (type === 'week') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 9); // 10 ngày
            endDate = now;
        } else if (type === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else { // year
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        }
    
        // --- Khoảng thời gian trước ---
        let prevStart: Date;
        let prevEnd: Date;
    
        if (type === 'week' || type === 'month') {
            prevStart = new Date(startDate);
            prevEnd = new Date(endDate);
            if (type === 'week') {
                prevStart.setDate(prevStart.getDate() - 10);
                prevEnd.setDate(prevEnd.getDate() - 10);
            } else {
                prevStart.setMonth(prevStart.getMonth() - 1, 1);
                prevEnd = new Date(prevStart.getFullYear(), prevStart.getMonth() + 1, 0);
            }
        } else { // year
            prevStart = new Date(startDate.getFullYear() - 1, 0, 1);
            prevEnd = new Date(endDate.getFullYear() - 1, 11, 31);
        }
    
        const formatVNDate = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7);
            return d.toISOString().split('T')[0];
        };
    
        // --- Lấy dữ liệu ---
        const bookings = await this.bookingRepo.find({ where: { createdAt: Between(startDate, endDate) }, relations: ['payment'] });
        const prevBookings = await this.bookingRepo.find({ where: { createdAt: Between(prevStart, prevEnd) }, relations: ['payment'] });
    
        // --- Tính tổng ---
        const totalBookings = bookings.length;
        const totalCancelled = bookings.filter(b => b.status === BookingStatus.CANCELLED).length;
        const totalRevenue = bookings.filter(b => b.payment?.paymentStatus === PaymentStatus.SUCCESS)
            .reduce((sum, b) => sum + Number(b.totalPrice), 0);
    
        const prevTotalBookings = prevBookings.length;
        const prevCancelled = prevBookings.filter(b => b.status === BookingStatus.CANCELLED).length;
        const prevRevenue = prevBookings.filter(b => b.payment?.paymentStatus === PaymentStatus.SUCCESS)
            .reduce((sum, b) => sum + Number(b.totalPrice), 0);
    
        // --- Tính changeRate 100% so với tổng ---
        const bookingsChangeRate = totalBookings + prevTotalBookings ? (totalBookings / (totalBookings + prevTotalBookings)) * 100 : 0;
        const cancelledChangeRate = totalCancelled + prevCancelled ? (totalCancelled / (totalCancelled + prevCancelled)) * 100 : 0;
        const revenueChangeRate = totalRevenue + prevRevenue ? (totalRevenue / (totalRevenue + prevRevenue)) * 100 : 0;
    
        // --- Khởi tạo chart ---
        const chartDates: string[] = [];
        const bookingsChartMap: Record<string, number> = {};
        const cancelledChartMap: Record<string, number> = {};
        const revenueChartMap: Record<string, number> = {};
    
        if (type === 'year') {
            for (let i = 0; i < 10; i++) {
                const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, '0')}`;
                chartDates.push(key);
                bookingsChartMap[key] = 0;
                cancelledChartMap[key] = 0;
                revenueChartMap[key] = 0;
            }
            bookings.forEach(b => {
                const key = `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
                if (key in bookingsChartMap) bookingsChartMap[key]++;
                if (key in cancelledChartMap && b.status === BookingStatus.CANCELLED) cancelledChartMap[key]++;
                if (key in revenueChartMap && b.payment?.paymentStatus === PaymentStatus.SUCCESS) revenueChartMap[key] += Number(b.totalPrice);
            });
        } else {
            for (let i = 9; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = formatVNDate(d);
                chartDates.push(key);
                bookingsChartMap[key] = 0;
                cancelledChartMap[key] = 0;
                revenueChartMap[key] = 0;
            }
            bookings.forEach(b => {
                const key = formatVNDate(b.createdAt);
                if (key in bookingsChartMap) bookingsChartMap[key]++;
                if (b.status === BookingStatus.CANCELLED && key in cancelledChartMap) cancelledChartMap[key]++;
                if (key in revenueChartMap && b.payment?.paymentStatus === PaymentStatus.SUCCESS) revenueChartMap[key] += Number(b.totalPrice);
            });
        }
    
        return {
            bookings: {
                total: totalBookings,
                changeRate: Number(bookingsChangeRate.toFixed(1)),
                chartData: Object.values(bookingsChartMap),
            },
            cancelled: {
                total: totalCancelled,
                changeRate: Number(cancelledChangeRate.toFixed(1)),
                chartData: Object.values(cancelledChartMap),
            },
            revenue: {
                total: totalRevenue,
                changeRate: Number(revenueChangeRate.toFixed(1)),
                chartData: Object.values(revenueChartMap),
            },
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

    //PI tổng hợp cho xuất Excel (gồm dữ liệu doanh thu, tổng lượt đặt, lượt hủy, và thống kê trạng thái booking) theo ba mốc:
    //7 ngày gần nhất, 30 (hoặc 31) ngày trong tháng hiện tại, và 12 tháng trong năm.
    async getExportData(type: 'week' | 'month' | 'year') {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        if (type === 'week') {
            // 7 ngày gần nhất
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
            endDate = now;
        } else if (type === 'month') {
            // Toàn bộ tháng vừa rồi
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else {
            // 12 tháng trong năm hiện tại
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        }

        const formatVNDate = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7);
            return d.toISOString().split('T')[0];
        };

        const bookings = await this.bookingRepo.find({
            where: { createdAt: Between(startDate, endDate) },
            relations: ['payment'],
        });

        // --- Khởi tạo dữ liệu theo type ---
        const labels: string[] = [];
        const dataMap: Record<string, {
            revenue: number;
            totalBookings: number;
            cancelledBookings: number;
            statusCount: Record<BookingStatus, number>;
        }> = {};

        if (type === 'year') {
            for (let m = 0; m < 12; m++) {
                const label = `${now.getFullYear()}-${(m + 1).toString().padStart(2, '0')}`;
                labels.push(label);
                dataMap[label] = {
                    revenue: 0,
                    totalBookings: 0,
                    cancelledBookings: 0,
                    statusCount: {
                        [BookingStatus.PENDING]: 0,
                        [BookingStatus.CONFIRMED]: 0,
                        [BookingStatus.CANCELLED]: 0,
                        [BookingStatus.COMPLETED]: 0,
                        [BookingStatus.EXPIRED]: 0,
                    },
                };
            }
        } else {
            let current = new Date(startDate);
            while (current <= endDate) {
                const label = formatVNDate(current);
                labels.push(label);
                dataMap[label] = {
                    revenue: 0,
                    totalBookings: 0,
                    cancelledBookings: 0,
                    statusCount: {
                        [BookingStatus.PENDING]: 0,
                        [BookingStatus.CONFIRMED]: 0,
                        [BookingStatus.CANCELLED]: 0,
                        [BookingStatus.COMPLETED]: 0,
                        [BookingStatus.EXPIRED]: 0,
                    },
                };
                current.setDate(current.getDate() + 1);
            }
        }

        // --- Gom dữ liệu ---
        for (const b of bookings) {
            const key =
                type === 'year'
                    ? `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}`
                    : formatVNDate(b.createdAt);

            if (!dataMap[key]) continue;

            dataMap[key].totalBookings++;
            dataMap[key].statusCount[b.status]++;
            if (b.status === BookingStatus.CANCELLED) dataMap[key].cancelledBookings++;

            if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                dataMap[key].revenue += Number(b.totalPrice);
            }
        }

        // --- Trả về mảng dữ liệu để xuất Excel ---
        const data = {
            revenue: labels.map(l => dataMap[l].revenue),
            totalBookings: labels.map(l => dataMap[l].totalBookings),
            cancelledBookings: labels.map(l => dataMap[l].cancelledBookings),
            statusCount: {
                pending: labels.map(l => dataMap[l].statusCount[BookingStatus.PENDING]),
                confirmed: labels.map(l => dataMap[l].statusCount[BookingStatus.CONFIRMED]),
                cancelled: labels.map(l => dataMap[l].statusCount[BookingStatus.CANCELLED]),
                completed: labels.map(l => dataMap[l].statusCount[BookingStatus.COMPLETED]),
                expired: labels.map(l => dataMap[l].statusCount[BookingStatus.EXPIRED]),
            },
        };

        return { type, labels, data };
    }

    //API thống kê tổng doanh thu theo khách sạn, đồng thời trả các thông tin cơ bản của khách sạn và gom nhóm dữ liệu
    async getRevenueByHotel(): Promise<any[]> {
        // Lấy tất cả booking với relations hotel, roomType, payment
        const bookings = await this.bookingRepo.find({
            relations: ['roomType', 'roomType.hotel', 'payment', 'roomType.hotel.city'],
        });

        // Tạo map lưu trữ dữ liệu theo hotelId
        const hotelMap: Record<number, any> = {};

        bookings.forEach(b => {
            const hotel = b.roomType.hotel;
            if (!hotel) return;

            if (!hotelMap[hotel.id]) {
                hotelMap[hotel.id] = {
                    hotelId: hotel.id,
                    hotelName: hotel.name,
                    cityImage: hotel.city?.image || null,
                    hotelAddress: hotel.address,
                    description: hotel.description || null,
                    policies: hotel.policies || null,
                    totalRevenue: 0,
                    totalBookings: 0,
                    statusCount: {
                        pending: 0,
                        confirmed: 0,
                        cancelled: 0,
                        completed: 0,
                        expired: 0
                    }
                };
            }

            hotelMap[hotel.id].totalBookings++;
            hotelMap[hotel.id].statusCount[b.status]++;

            if (b.payment?.paymentStatus === PaymentStatus.SUCCESS) {
                hotelMap[hotel.id].totalRevenue += Number(b.totalPrice);
            }
        });

        // Chuyển map thành array để trả về
        return Object.values(hotelMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    //Thống kê theo phương thức thanh toán cho từng khoảng thời gian (tuần, tháng, năm) và xuất ra Excel
    async getPaymentStatsForExcel(type: 'week' | 'month' | 'year') {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        // Xác định khoảng thời gian
        if (type === 'week') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // 7 ngày
            endDate = now;
        } else if (type === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else { // year
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        }

        const formatDateVN = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7); // UTC+7
            return d.toISOString().split('T')[0];
        }

        // Lấy bookings trong khoảng thời gian
        const bookings = await this.bookingRepo.find({
            where: { createdAt: Between(startDate, endDate) },
            relations: ['payment'],
        });

        // Khởi tạo map theo payment method, thêm ZALOPAY và STRIPE
        const paymentData: Record<string, number[]> = {
            cod: [],
            momo: [],
            vnpay: [],
            zalopay: [],
            stripe: [],
        };

        const labels: string[] = [];

        // Xác định từng ngày/tháng
        if (type === 'year') {
            for (let m = 0; m < 12; m++) {
                const monthKey = `${now.getFullYear()}-${(m + 1).toString().padStart(2, '0')}`;
                labels.push(monthKey);
                Object.keys(paymentData).forEach(key => paymentData[key].push(0));
            }

            bookings.forEach(b => {
                if (b.payment?.paymentStatus !== PaymentStatus.SUCCESS) return;
                const key = `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
                const idx = labels.indexOf(key);
                if (idx === -1) return;
                const method = b.payment.paymentMethod.toLowerCase();
                if (method in paymentData) paymentData[method][idx] += Number(b.totalPrice);
            });
        } else {
            let current = new Date(startDate);
            while (current <= endDate) {
                const dayKey = formatDateVN(current);
                labels.push(dayKey);
                Object.keys(paymentData).forEach(key => paymentData[key].push(0));
                current.setDate(current.getDate() + 1);
            }

            bookings.forEach(b => {
                if (b.payment?.paymentStatus !== PaymentStatus.SUCCESS) return;
                const key = formatDateVN(b.createdAt);
                const idx = labels.indexOf(key);
                if (idx === -1) return;
                const method = b.payment.paymentMethod.toLowerCase();
                if (method in paymentData) paymentData[method][idx] += Number(b.totalPrice);
            });
        }

        return { type, labels, paymentData };
    }

}
