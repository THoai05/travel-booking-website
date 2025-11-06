"use client";
import React from 'react';

// Định nghĩa cấu trúc dữ liệu nhận được từ Backend (từ useStatsData hook)
interface StatsDataProps {
    avgDailyBookings: string; // Đã tính ở BE
    totalRevenue: string;     // Đã tính ở BE
// ...
}

interface DetailedCardsProps {
    data: StatsDataProps; // Nhận dữ liệu đã được tính toán từ Backend
}

// Khai báo mảng cần hiển thị
const MOCK_LABELS = [
    { key: "avgDailyBookings", label: "Đặt phòng trung bình hàng ngày", unit: "" },
    { key: "totalRevenue", label: "Tổng doanh thu", unit: "" },
    { key: "avgStayDuration", label: "Thời gian lưu trú trung bình", unit: " days" },
    { key: "customerRating", label: "Đánh giá của khách hàng", unit: "" },
];

export default function DetailedCards({ data }: DetailedCardsProps) {

    // Tạo data hiển thị bằng cách map và sử dụng dữ liệu thật từ Backend
    const details = MOCK_LABELS.map((item) => {
        let value = "";

        switch (item.key) {
            case 'avgDailyBookings':
                value = data.avgDailyBookings; // Dữ liệu thật
                break;
            case 'totalRevenue':
                value = data.totalRevenue; // Dữ liệu thật (đã format tiền tệ)
                break;
            default:
                // Giữ nguyên giá trị mock cho các chỉ số chưa code Backend
                if (item.key === 'avgStayDuration') value = "2.3";
                else if (item.key === 'customerRating') value = "4.7/5";
        }

        return {
            label: item.label,
            value: value,
            unit: item.unit
        };
    });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="font-semibold mb-4 text-lg">Thống kê chi tiết</h3>
            <div className="grid grid-cols-4 gap-6">
                {details.map((detail, index) => (
                    <div key={index} className="text-center p-4 border rounded-xl">
                        {/* FIX: Thêm whitespace-nowrap để ngăn tràn số liệu cực lớn */}
                        <h2 className="text-3xl font-bold text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis">
                            {detail.value}
                            {detail.unit && ` ${detail.unit}`}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">{detail.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
