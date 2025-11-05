"use client";
import React from 'react';
import { TrendingUp, TrendingDown, Clock, LucideIcon } from 'lucide-react';

// Định nghĩa lại cấu trúc dữ liệu nhận được từ Page/Hook
interface StatsDataProps {
    totalBookings: string;
    totalCancellations: string;
    occupancyRate: string;
    changeBookings: string;
    changeCancellations: string;
    // Tui thêm các trường khác để tránh lỗi TypeScript nếu chúng được truyền
    ratioSuccessful: number;
    ratioCancelled: number;
    avgDailyBookings: string;
    totalRevenue: string;
}

interface StatsHeaderProps {
    data: StatsDataProps; // Nhận dữ liệu đã được tính toán từ Backend
}

interface StatItem {
    label: string;
    value: string;
    change: string;
    color: string;
    icon: LucideIcon;
}

// Hàm phụ trợ để map data nhận được từ API vào cấu trúc UI
const mapDataToStats = (data: StatsDataProps): StatItem[] => ([
    {
        label: "Total Bookings",
        value: data.totalBookings,
        change: data.changeBookings,
        color: "text-green-600",
        icon: TrendingUp
    },
    {
        label: "Total Cancellations",
        value: data.totalCancellations,
        change: data.changeCancellations,
        color: "text-red-600",
        icon: TrendingDown
    },
    {
        label: "Occupancy Rate",
        value: data.occupancyRate,
        // Pro cần thêm logic tính change Occupancy ở BE, tạm dùng mock
        change: "+5.1%",
        color: "text-blue-600",
        icon: Clock
    },
]);

// FIX CÚ PHÁP: Arrow Function chuẩn mực
export default function StatsHeader({ data }: StatsHeaderProps) {
    // Dữ liệu đã được map
    const stats = mapDataToStats(data);

    return (
        <div className="grid grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
                            <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                        </div>
                        <stat.icon className={`w-8 h-8 p-1.5 rounded-full ${stat.color} bg-opacity-10 bg-current`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

