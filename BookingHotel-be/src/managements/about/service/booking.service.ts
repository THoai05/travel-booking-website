import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';


const ExcelJS = require('exceljs');

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
    ) { }

    // Logic findAllBookingsForTable (Logic giữ nguyên)
    async findAllBookingsForTable(): Promise<any[]> {
        // Sử dụng TypeORM find với relations (cần TypeORM Repository của Booking)
        const bookings = await this.bookingRepository.find({
            relations: ['room', 'room.hotel'],
            order: { createdAt: 'DESC' as 'DESC' },
            take: 100,
        });

        // Map data (giữ nguyên)
        return bookings.map(b => ({
            id: `#BK${String(b.id).padStart(5, '0')}`,
            name: b.room?.hotel?.name || 'N/A',
            date: b.createdAt.toLocaleDateString('vi-VN'),
            price: parseFloat(b.totalPrice as any).toLocaleString('vi-VN') + '₫',
            payment: 'Đã thanh toán',
            status: b.status,
        }));
    }

    // Logic exportBookingExcel (Logic giữ nguyên)
    async exportBookingExcel(): Promise<Buffer> {
        const dataToExport = await this.findAllBookingsForTable();

        // ... (Code ExcelJS giữ nguyên) ...

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Báo cáo Chi tiết Đặt phòng');
        worksheet.columns = [
            { header: 'Mã đơn', key: 'id', width: 15 },
            { header: 'Khách sạn', key: 'name', width: 35 },
            { header: 'Ngày đặt', key: 'date', width: 15 },
            { header: 'Giá tiền', key: 'price', width: 20 },
            { header: 'Thanh toán', key: 'payment', width: 15 },
            { header: 'Trạng thái', key: 'status', width: 15 },
        ];
        worksheet.addRows(dataToExport);

        return workbook.xlsx.writeBuffer() as Promise<Buffer>;
    }
}
