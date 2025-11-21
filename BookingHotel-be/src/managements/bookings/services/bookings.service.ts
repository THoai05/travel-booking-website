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
import { Coupon } from 'src/managements/coupons/entities/coupons.entity';

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
        private readonly ratePlanRepo: Repository<RatePlan>,
        @InjectRepository(Coupon)
        private readonly couponRepo: Repository<Coupon>
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
            },
            relations: ['hotel']
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
            hotelName: bookingSaved.roomType.hotel.name,
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
            status,
            couponId,
            couponCode, totalPrice
        } = body


        console.log("body duoc gui len ", body)

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



        if (couponCode || couponId) {


            const conditions: any[] = [];

            if (couponCode) conditions.push({ code: couponCode });

            const parsedId = Number(couponId);
            if (!isNaN(parsedId)) conditions.push({ id: parsedId });


            const coupon = await this.couponRepo.findOne({
                where:
                    conditions
            });

            if (!coupon) {
                throw new BadRequestException("Khong tim thay coupon nao")
            }
            if (coupon.discountType === 'percent') {
                updateBookingData.totalPriceUpdate = updateBookingData.totalPrice - Math.floor(updateBookingData.totalPrice / 100 * Number(coupon.discountValue))
            } else {
                updateBookingData.totalPriceUpdate = updateBookingData.totalPrice - Math.floor(Number(coupon.discountValue))
            }
        }

        if (totalPrice) {
            updateBookingData.totalPrice = Number(totalPrice)
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
            status: updateBookingSaved.status,
            totalPriceUpdate: updateBookingSaved.totalPriceUpdate
        }
    }

    async getFullDataBookingById(id: number):Promise<BookingResponseManagement>  {
        const booking = await this.bookingRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.user', 'user')
            .leftJoinAndSelect('booking.roomType', 'roomType')
            .leftJoinAndSelect('roomType.hotel', 'hotel')
            .where('booking.id = :id', { id })
            .getOne()
        if (!booking) {
            throw new NotFoundException("Không tìm thấy đơn hàng này")
        }
          return {
            bookingId: booking.id,
            userId: booking.user.id,
            hotelName: booking.roomType.hotel.name,
            hotelAddress: booking.roomType.hotel.name,
            hotelPhone: booking.roomType.hotel.phone,
            roomTypeId: booking.roomType.id,
            roomTypeName: booking.roomType.name,
            checkinDate: booking.checkInDate,
            checkoutDate: booking.checkOutDate,
            guestsCount: booking.guestsCount,
            bedType: booking.roomType.bed_type,
            roomName: booking.roomType.name,
            totalPrice: booking.totalPrice,
            contactFullName: booking.contactFullName,
            contactEmail: booking.contactEmail,
            contactPhone: booking.contactPhone,
            guestsFullName: booking.guestFullName,
            status: booking.status,
            totalPriceUpdate: booking.totalPriceUpdate
        }
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
        let endDate: Date = now;

        const formatVNDate = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7); // UTC+7
            return d.toISOString().split('T')[0];
        };

        // --- Xác định khoảng thời gian ---
        if (type === 'week') {
            startDate = new Date();
            startDate.setDate(now.getDate() - 6); // 7 ngày gần nhất
        } else if (type === 'month') {
            const daysToShow = 30;
            startDate = new Date();
            startDate.setDate(now.getDate() - (daysToShow - 1)); // 30 ngày gần nhất
        } else { // year
            startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 tháng gần nhất
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

        // --- Khởi tạo bookingsByPeriod ---
        const bookingsByPeriod: Record<string, { count: number; revenue: number }> = {};

        if (type === 'year') {
            let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            while (current <= endDate) {
                const monthKey = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`;
                bookingsByPeriod[monthKey] = { count: 0, revenue: 0 };
                current.setMonth(current.getMonth() + 1);
            }
        } else { // week hoặc month
            let current = new Date(startDate);
            while (current <= endDate) {
                const dayKey = formatVNDate(current);
                bookingsByPeriod[dayKey] = { count: 0, revenue: 0 };
                current.setDate(current.getDate() + 1);
            }
        }

        // --- Gom dữ liệu ---
        for (const b of bookings) {
            const key =
                type === 'year'
                    ? `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth() + 1).toString().padStart(2, '0')}`
                    : formatVNDate(b.createdAt);

            if (!bookingsByPeriod[key]) continue;

            bookingsByPeriod[key].count++;
            if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                bookingsByPeriod[key].revenue += Number(b.totalPrice);
            }
        }

        // --- Thống kê doanh thu theo payment method ---
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
        let endDate: Date = now;

        const formatVNDate = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7);
            return d.toISOString().split('T')[0];
        };

        // --- Xác định khoảng thời gian ---
        if (type === 'week') {
            startDate = new Date();
            startDate.setDate(now.getDate() - 6); // 7 ngày gần nhất
        } else if (type === 'month') {
            const daysToShow = 30;
            startDate = new Date();
            startDate.setDate(now.getDate() - (daysToShow - 1)); // 30 ngày gần nhất
        } else { // year
            startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 tháng gần nhất
        }

        // Lấy bookings trong khoảng thời gian
        const bookings = await this.bookingRepo.find({
            where: { createdAt: Between(startDate, endDate) },
            relations: ['payment'],
        });

        const labels: string[] = [];
        const dataMap: Record<string, {
            revenue: number;
            totalBookings: number;
            cancelledBookings: number;
            unpaidBookings: number;
            unpaidRevenue: number;
            statusCount: Record<BookingStatus, number>;
        }> = {};

        // --- Tạo labels và dataMap ---
        if (type === 'year') {
            let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            while (current <= endDate) {
                const label = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`;
                labels.push(label);
                dataMap[label] = {
                    revenue: 0,
                    totalBookings: 0,
                    cancelledBookings: 0,
                    unpaidBookings: 0,
                    unpaidRevenue: 0,
                    statusCount: {
                        [BookingStatus.PENDING]: 0,
                        [BookingStatus.CONFIRMED]: 0,
                        [BookingStatus.CANCELLED]: 0,
                        [BookingStatus.COMPLETED]: 0,
                        [BookingStatus.EXPIRED]: 0,
                    },
                };
                current.setMonth(current.getMonth() + 1);
            }
        } else { // week hoặc month
            let current = new Date(startDate);
            while (current <= endDate) {
                const label = formatVNDate(current);
                labels.push(label);
                dataMap[label] = {
                    revenue: 0,
                    totalBookings: 0,
                    cancelledBookings: 0,
                    unpaidBookings: 0,
                    unpaidRevenue: 0,
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
                    ? `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth() + 1).toString().padStart(2, '0')}`
                    : formatVNDate(b.createdAt);

            if (!dataMap[key]) continue;

            dataMap[key].totalBookings++;
            dataMap[key].statusCount[b.status]++;
            if (b.status === BookingStatus.CANCELLED) dataMap[key].cancelledBookings++;

            if (b.payment && b.payment.paymentStatus === PaymentStatus.SUCCESS) {
                dataMap[key].revenue += Number(b.totalPrice);
            } else {
                dataMap[key].unpaidBookings++;
                dataMap[key].unpaidRevenue += Number(b.totalPrice);
            }
        }

        // --- Trả về mảng dữ liệu ---
        const data = {
            revenue: labels.map(l => dataMap[l].revenue),
            totalBookings: labels.map(l => dataMap[l].totalBookings),
            cancelledBookings: labels.map(l => dataMap[l].cancelledBookings),
            unpaidBookings: labels.map(l => dataMap[l].unpaidBookings),
            unpaidRevenue: labels.map(l => dataMap[l].unpaidRevenue),
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
        let endDate: Date = now;

        const formatDateVN = (date: Date) => {
            const d = new Date(date);
            d.setHours(d.getHours() + 7); // UTC+7
            return d.toISOString().split('T')[0];
        }

        // Xác định khoảng thời gian
        if (type === 'week') {
            startDate = new Date();
            startDate.setDate(now.getDate() - 6); // 7 ngày gần đây
        } else if (type === 'month') {
            const daysToShow = 31;
            startDate = new Date();
            startDate.setDate(now.getDate() - (daysToShow - 1)); // 30 ngày gần đây
        } else { // year
            startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 tháng gần đây
        }

        // Lấy bookings trong khoảng thời gian
        const bookings = await this.bookingRepo.find({
            where: { createdAt: Between(startDate, endDate) },
            relations: ['payment'],
        });

        const paymentData: Record<string, number[]> = {
            cod: [], momo: [], vnpay: [], zalopay: [], stripe: [],
        };

        const labels: string[] = [];

        if (type === 'year') {
            // Tạo 12 tháng từ startDate đến endDate
            let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            while (current <= endDate) {
                const monthKey = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`;
                labels.push(monthKey);
                Object.keys(paymentData).forEach(key => paymentData[key].push(0));
                current.setMonth(current.getMonth() + 1);
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
            // week hoặc month: hiển thị theo từng ngày
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

    //Lấy tất cả danh sách booking
    async getAllBooking() {
        return this.bookingRepo
            .createQueryBuilder('b')
            .leftJoin('b.user', 'u')
            .leftJoin('b.payment', 'p')
            .select([
                'u.id AS userId',
                'u.username AS username',
                'u.fullName AS fullName',
                'u.email AS email',
                'u.lastLogin AS lastLogin',
                'u.createdAt AS userCreatedAt',
                'u.updatedAt AS userUpdatedAt',
                'u.avatar AS avatar',
                'u.provider AS provider',

                // Aggregates
                'COUNT(b.id) AS totalBookings',
                `SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) AS pending`,
                `SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed`,
                `SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled`,
                `SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) AS completed`,
                `SUM(CASE WHEN b.status = 'expired' THEN 1 ELSE 0 END) AS expired`,

                // Payment stats
                `SUM(CASE WHEN p.payment_status = 'success' THEN p.amount ELSE 0 END) AS paidAmount`,
                `SUM(CASE WHEN p.payment_status = 'pending' THEN p.amount ELSE 0 END) AS unpaidAmount`,
                `SUM(CASE WHEN p.payment_status = 'success' THEN 1 ELSE 0 END) AS totalPaid`,
                `SUM(CASE WHEN p.payment_status = 'pending' THEN 1 ELSE 0 END) AS totalUnpaid`,
            ])
            .groupBy('u.id')
            .orderBy('u.createdAt', 'DESC')
            .getRawMany();
    }


}
