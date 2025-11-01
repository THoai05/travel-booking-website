"use client";

import { FileText } from "lucide-react"
import { useApi } from "../about/useAPI";
import { useDownloader } from "../about/useDownExel";

// Định nghĩa Interface (hoặc Type) cho dữ liệu trả về
/**
 * @typedef {object} BookingItem
 * @property {string} id Mã đơn đặt phòng (ví dụ: #BK00123)
 * @property {string} name Tên Khách sạn
 * @property {string} date Ngày đặt (đã format)
 * @property {string} price Giá tiền (đã format)
 * @property {string} payment Phương thức thanh toán (tạm hardcode)
 * @property {string} status Trạng thái đơn hàng
 */

export default function BookingTable() {
    // 1. Lấy data và loading state cho bảng
    /** @type {{data: BookingItem[] | null, loading: boolean, error: any}} */
    const { data: bookingData, loading, error } = useApi('/bookings/list');
    const dataToRender = bookingData || [];

    // 2. GỌI HOOK TẢI FILE MỚI
    const { downloadFile, isDownloading, downloadError } = useDownloader();


    // --- HANDLER XUẤT EXCEL (GỌI HOOK) ---
    const handleExportExcel = () => {
        downloadFile(
            '/bookings/export/excel', // Endpoint BE để xuất Excel
            'chi_tiet_dat_phong.xlsx', // Tên file
        );
    };
    // ----------------------------


    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center gap-4">
                <h3 className="font-semibold mb-4">Chi tiết đặt phòng</h3>
                <div className="flex gap-3 ">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn đặt phòng..."
                        className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* Nút xuất Excel (Gắn Handler) */}
                    <button
                        onClick={handleExportExcel}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        <FileText className="w-5 h-5" />
                        <span>{isDownloading ? "Đang xuất..." : "Xuất Excel"}</span>
                    </button>

                    {/* Nút xuất PDF (Logic này nằm ở Header.js) */}
                    <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                        <FileText className="w-5 h-5" />
                        <span>Xuất PDF</span>
                    </button>

                </div>
            </div>

            {/* Hiển thị lỗi tải xuống nếu có */}
            {downloadError && (
                <div className="text-red-500 bg-red-100 p-2 rounded-lg my-2">
                    Lỗi tải file: {downloadError}
                </div>
            )}

            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-2">Mã đơn</th>
                        <th>Khách sạn</th>
                        <th>Ngày đặt</th>
                        <th>Giá</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr><td colSpan="6" className="text-center py-4 text-blue-600">Đang tải dữ liệu... ⏳</td></tr>
                    )}

                    {!loading && dataToRender.map((item) => (
                        <tr key={item.id} className="border-b last:border-none hover:bg-gray-50">
                            <td className="py-2">{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.date}</td>
                            <td>{item.price}</td>
                            <td>{item.payment}</td>
                            <td>{item.status}</td>
                        </tr>
                    ))}

                    {!loading && dataToRender.length === 0 && (
                        <tr><td colSpan="6" className="text-center py-4 text-gray-500">Chưa có đơn đặt phòng nào.</td></tr>
                    )}
                </tbody>
            </table>
        </div >
    );
}
