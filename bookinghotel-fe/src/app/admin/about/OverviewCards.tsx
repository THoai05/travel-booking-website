"use client";

import { useApi } from "../about/useAPI"; // Đảm bảo đường dẫn hook là chính xác!

export default function OverviewCards() {
    // Gọi API tổng hợp từ BE: /api/revenue/summary
    const { data: summaryData, loading, error } = useApi('/revenue/summary');

    // Mảng dữ liệu thẻ - dùng fallback nếu đang loading
    const cards = [
        {
            label: "Tổng doanh thu tháng này",
            // Hiển thị loading hoặc dữ liệu từ BE
            value: loading ? "Đang tải..." : (summaryData?.revenueDisplay || "0₫"),
            change: summaryData?.revenueChange || "0%", 
            color: "text-blue-600"
        },
        {
            label: "Tổng số đơn đặt phòng",
            value: loading ? "..." : (summaryData?.totalBookings.toLocaleString() || "0"),
            change: summaryData?.bookingsChange || "0%",
            color: "text-green-600"
        },
        {
            label: "Khách hàng mới",
            value: loading ? "..." : (summaryData?.newCustomers.toLocaleString() || "0"),
            change: "+4.2%",
            color: "text-purple-600"
        },
        {
            label: "Tỷ lệ tăng trưởng",
            value: loading ? "..." : (summaryData?.growthRate || "0%"),
            change: "so với tháng trước",
            color: "text-orange-600"
        },
    ];

    // Xử lý lỗi (Nếu có lỗi và không loading)
    if (error && !loading) {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-xl col-span-4">
                <p className="font-semibold">Lỗi tải dữ liệu tổng quan!</p>
                <p className="text-sm">Vui lòng kiểm tra Server Backend.</p>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {cards.map((item, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                    <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                    <h2 className="text-xl font-semibold">{item.value}</h2>
                    <p className={`${item.color} text-sm mt-1`}>{item.change}</p>
                </div>
            ))}
        </div>
    );
}
