import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/managements/bookings/entities/bookings.entity';

const ExcelJS = require('exceljs');

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
    ) { }

    async findAllBookingsForTable(search?: string): Promise<any[]> {

        // --- CHUYỂN SANG QueryBuilder ĐỂ XỬ LÝ JOIN VÀ TÌM KIẾM ---
        const query = this.bookingRepository.createQueryBuilder('b')
            // JOIN 2 tầng: Booking -> RoomType -> Hotel
            .leftJoinAndSelect('b.roomType', 'rt')
            .leftJoinAndSelect('rt.hotel', 'h')
            .orderBy('b.createdAt', 'DESC')
            .take(100);

        if (search) {
            // Lọc theo ID (cần chuyển sang string) HOẶC Tên khách sạn
            // b.id là số, nên cần CAST sang CHAR để dùng LIKE
            query.where("CAST(b.id AS CHAR) LIKE :search OR h.name LIKE :search", { search: `%${search}%` });
        }

        const bookings = await query.getMany();

        // --- Logic Map Data ---
        return bookings.map(b => ({
            id: `#BK${String(b.id).padStart(5, '0')}`,
            name: b.roomType?.hotel?.name || 'N/A',
            date: b.createdAt.toLocaleDateString('vi-VN'),
            price: parseFloat(b.totalPrice as any).toLocaleString('vi-VN') + '₫',
            payment: 'Đã thanh toán',
            status: b.status,
        }));
    }

    // Logic exportBookingExcel cũng cần được cập nhật để nhận tham số search
    async exportBookingExcel(search?: string): Promise<Buffer> {
        // Gọi hàm đã sửa với tham số search
        const dataToExport = await this.findAllBookingsForTable(search);

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
