"use client";
import { FileText } from "lucide-react";


const handleExportPdf = async () => {
    try {
        // Gọi API Export PDF
        const API_URL = 'http://localhost:3636/api/revenue/export/pdf';

        const response = await fetch(API_URL, { method: 'GET' });

        if (!response.ok) {
            console.error("Lỗi khi tải file PDF:", response.statusText);
            // Dùng logic hiển thị thông báo lỗi custom thay vì alert()
            alert('Lỗi khi tạo báo cáo PDF!');
            return;
        }

        // Tạo link tải xuống tự động
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'bao_cao_doanh_thu_tong_hop.pdf');

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Network Error:", error);
    }
};

export default function Header() {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Quản lý Doanh thu & Báo cáo</h1>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleExportPdf} // <-- Gắn hàm Export PDF
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FileText size={18} /> Xuất báo cáo
                </button>
                <img
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                />
            </div>
        </div>
    );
}
