"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

// Khai báo Interface cho mỗi điểm dữ liệu xu hướng (Phải khớp với BE)
interface TrendItem {
    month: string;
    Bookings: number; // Tổng số đơn đặt (Bookings + Confirmed)
    Cancellations: number; // Tổng số đơn hủy
}

interface TrendsChartProps {
    // Nhận toàn bộ data object từ Page, sau đó dùng trendsData
    data: { trendsData: TrendItem[] };
}

// Cú pháp Function truyền thống (Export default function TênComponent(props))
export default function TrendsChart({ data }: TrendsChartProps) {
    // Lấy data trends từ props (đã được fetch từ Backend)
    const dataToRender = data?.trendsData || [];

    // Kiểm tra nếu không có data thì hiển thị thông báo
    const hasData = dataToRender.length > 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="font-semibold mb-4 text-lg">Booking trends over time</h3>

            <ResponsiveContainer width="100%" height={256}>
                {hasData ? (
                    <LineChart data={dataToRender}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {/* Line cho Bookings (Tổng số đơn đặt) */}
                        <Line type="monotone" dataKey="Bookings" stroke="#3b82f6" activeDot={{ r: 8 }} name="Bookings" />
                        {/* Line cho Cancellations (Tổng số đơn hủy) */}
                        <Line type="monotone" dataKey="Cancellations" stroke="#ef4444" name="Cancellations" />
                    </LineChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 font-medium">
                        Không có dữ liệu xu hướng trong khoảng thời gian này.
                    </div>
                )}
            </ResponsiveContainer>
        </div>
    );
}
