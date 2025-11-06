"use client";

import { FileText } from "lucide-react"
import { useApi } from "../about/useAPI";
import { useDownloader } from "../about/useDownExel"; // Đã đổi tên file
import { useState, useMemo } from "react";

export default function BookingTable() {
    // State để lưu trữ từ khóa tìm kiếm
    const [searchKeyword, setSearchKeyword] = useState('');

    // Dùng useMemo để debounce và chỉ gửi request khi keyword ổn định
    const apiParams = useMemo(() => ({
        search: searchKeyword,
    }), [searchKeyword]);

    // Gọi API với tham số tìm kiếm
    const { data: bookingData, loading, error } = useApi('/bookings/list', apiParams);
    const dataToRender = bookingData || [];

    // Tải file logic
    const { downloadFile, isDownloading, downloadError } = useDownloader();
    const handleExportExcel = () => {
        // Endpoint xuất Excel không cần tham số search vì BE sẽ tự gọi findAllBookingsForTable
        // Tuy nhiên, nếu muốn xuất data đã search, ta phải truyền searchKeyword vào endpoint:
        // downloadFile(`/bookings/export/excel?search=${searchKeyword}`, 'chi_tiet_dat_phong.xlsx');
        downloadFile('/bookings/export/excel', 'chi_tiet_dat_phong.xlsx');
    };


    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center gap-4">
                <h3 className="font-semibold mb-4">Chi tiết đặt phòng</h3>
                <div className="flex gap-3 ">
                    <input
                        type="text"
                        placeholder="Tìm kiếm mã đơn hoặc tên khách sạn..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Nút xuất Excel */}
                    <button
                        onClick={handleExportExcel}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        <FileText className="w-5 h-5" />
                        <span>{isDownloading ? "Đang xuất..." : "Xuất Excel"}</span>
                    </button>
                    {/* ... Nút PDF ... */}
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

                    {/* Dùng index làm key dự phòng nếu item.id bị lỗi */}
                    {!loading && dataToRender.map((item, index) => (
                        <tr key={item.id || index} className="border-b last:border-none hover:bg-gray-50">
                            <td>{item.id}</td>
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
        </div>
    );
}
