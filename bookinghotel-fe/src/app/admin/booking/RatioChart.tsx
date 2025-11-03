"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Định nghĩa lại cấu trúc dữ liệu nhận được từ Page/Hook
interface StatsDataProps {
    totalBookings: string;
    totalCancellations: string;
    occupancyRate: string;
    changeBookings: string;
    changeCancellations: string;
    // CÁC TRƯỜNG CẦN THIẾT CHO BIỂU ĐỒ TỶ LỆ
    ratioSuccessful: number;
    ratioCancelled: number;
// ... các trường khác
}

interface RatioChartProps {
    data: StatsDataProps; // Nhận dữ liệu đã được tính toán từ Backend
}

// Màu sắc cho biểu đồ (Xanh dương cho Thành công, Đỏ cho Hủy bỏ)
const COLORS = {
    SUCCESS: '#3b82f6', // Xanh dương
    CANCELLED: '#ef4444', // Đỏ
};

// CÚ PHÁP ĐÚNG: Export default function TênComponent(props)
export default function RatioChart({ data }: RatioChartProps) {

    // TẠO DATA THẬT TỪ PROPS
    const chartData = [
        { name: 'Đặt chỗ thành công', value: data.ratioSuccessful, color: COLORS.SUCCESS },
        { name: 'Hủy bỏ', value: data.ratioCancelled, color: COLORS.CANCELLED },
    ];

    // Lấy tổng số đơn hàng (dạng số) để kiểm tra trạng thái rỗng
    const totalBookings = parseFloat(data.totalBookings.replace(/,/g, '')) || 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="font-semibold mb-4 text-lg">Booking rate vs cancellation rate</h3>

            {totalBookings === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500 font-medium">
                    Không có dữ liệu đặt phòng trong khoảng thời gian này.
                </div>
            ) : (
                    <div className="flex items-center justify-around h-64">
                        <ResponsiveContainer width="45%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    labelLine={false}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                {/* Tooltip hiển thị giá trị phần trăm */}
                                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Tỷ lệ']} />
                            </PieChart>
                        </ResponsiveContainer>

                        <ul className="text-sm space-y-2">
                            {chartData.map((item, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                    {item.name}: {item.value.toFixed(1)}%
                                </li>
                            ))}
                        </ul>
                    </div>
            )}
        </div>
    );
}
