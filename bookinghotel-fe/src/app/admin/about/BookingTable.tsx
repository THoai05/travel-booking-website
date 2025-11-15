"use client";

import { FileText, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
// ✅ Đã sửa đường dẫn import để giải quyết lỗi biên dịch
import { useApi } from "./useAPI";
import { useDownloader } from "./useDownExel";
import { useState, useMemo } from "react";

export default function BookingTable() {
    // State cho Tìm kiếm
    const [searchKeyword, setSearchKeyword] = useState('');

    // 💡 Lấy các thông tin phân trang (page, totalPages, changePage) từ useApi
    const {
        data: bookingData,
        loading,
        error,
        page,          // Trang hiện tại
        limit,         // Giới hạn item/trang
        totalPages,    // Tổng số trang
        changePage,    // Hàm thay đổi trang
        totalItems     // Tổng số item
    } = useApi('/bookings/list', { search: searchKeyword }); //  Tham số tìm kiếm tự động được truyền

    const dataToRender = bookingData || [];

    // Tải file logic
    const { downloadFile, isDownloading, downloadError } = useDownloader();

    const handleExportExcel = () => {
        //  TRUYỀN THAM SỐ SEARCH vào endpoint xuất Excel
        downloadFile(`/bookings/export/excel?search=${searchKeyword}`, 'chi_tiet_dat_phong.xlsx');
    };

    // --- Logic Phân trang ---
    const handlePrev = () => {
        changePage(page - 1);
    };

    const handleNext = () => {
        changePage(page + 1);
    };


    if (error) {
        return <div className="p-4 text-red-600 bg-red-50 rounded-lg">❌ Lỗi tải dữ liệu: {error.message || "Không thể kết nối đến máy chủ."}</div>;
    }


    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Chi tiết đặt phòng ({totalItems} đơn)</h3>
                <div className="flex gap-3">
                    {/* Input Tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm mã đơn hoặc tên khách sạn..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    />

                    {/* Nút xuất Excel */}
                    <button
                        onClick={handleExportExcel}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                        <span>{isDownloading ? "Xuất Excel..." : "Xuất Excel"}</span>
                    </button>
                </div>
            </div>

            {/* Hiển thị lỗi tải xuống nếu có */}
            {downloadError && (
                <div className="text-red-500 bg-red-100 p-2 rounded-lg my-2">
                    Lỗi tải file: {downloadError}
                </div>
            )}

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="text-gray-600 border-b bg-gray-50 uppercase">
                            <th className="py-3 px-4">Mã đơn</th>
                            <th className="py-3 px-4">Khách sạn</th>
                            <th className="py-3 px-4">Ngày đặt</th>
                            <th className="py-3 px-4">Giá</th>
                            <th className="py-3 px-4">Thanh toán</th>
                            <th className="py-3 px-4">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && dataToRender.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-blue-600 font-medium"><Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" /> Đang tải dữ liệu... ⏳</td></tr>
                        ) : !loading && dataToRender.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-500">Chưa tìm thấy đơn đặt phòng nào.</td></tr>
                        ) : (
                            dataToRender.map((item, index) => (
                                <tr key={item.id || index} className="border-b last:border-none hover:bg-gray-50 transition duration-75">
                                    <td className="py-3 px-4 font-medium text-blue-600">{item.id}</td>
                                    <td className="py-3 px-4">{item.name}</td>
                                    <td className="py-3 px-4">{item.date}</td>
                                    <td className="py-3 px-4 font-semibold text-green-700">{item.price}</td>
                                    <td className="py-3 px-4">{item.payment}</td>
                                    <td className="py-3 px-4">{item.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- Thanh Phân trang (Pagination) --- */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t mt-4 bg-gray-50 rounded-b-xl -mx-5 -mb-5">

                    {/* Thông tin */}
                    <p className="text-gray-600 text-sm">
                        Đang hiển thị {limit} mục trên tổng số <span className="font-semibold">{totalItems}</span>
                    </p>

                    {/* Nút điều hướng */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrev}
                            disabled={page <= 1 || loading}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition ${page <= 1 || loading
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-200 border-gray-300"
                                }`}
                        >
                            <ChevronLeft size={16} /> Trước
                        </button>

                        <p className="text-gray-700 text-sm">
                            Trang <span className="font-bold text-blue-600">{page}</span> / {totalPages}
                        </p>

                        <button
                            onClick={handleNext}
                            disabled={page >= totalPages || loading}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition ${page >= totalPages || loading
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-200 border-gray-300"
                                }`}
                        >
                            Sau <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
