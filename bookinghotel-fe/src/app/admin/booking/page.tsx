"use client";
import React, { useState } from 'react';
// Đảm bảo các đường dẫn này là chính xác
import StatsHeader from './StatsHeader';
import RatioChart from './RatioChart';
import TrendsChart from './TrendsChart';
import DetailedCards from './DetailedCards';

export default function StatisticsPage() {
    // State để quản lý khoảng thời gian (filter)
    const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-semibold mb-6">Booking Statistics Dashboard</h1>

            {/* Thanh lọc thời gian */}
            <div className="flex justify-end items-center bg-white p-4 mb-4 rounded-2xl shadow-sm space-x-4">
                <p className="font-medium">Time Period:</p>
                <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="border p-2 rounded-lg"
                />
                <span>to</span>
                <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="border p-2 rounded-lg"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Apply Filter
                </button>
            </div>

            <StatsHeader />

            <div className="grid grid-cols-2 gap-6 mb-6">
                <RatioChart />
                <TrendsChart />
            </div>

            <DetailedCards />
        </div>
    );
};

