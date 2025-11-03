"use client";
import React, { useState } from 'react';
// Đảm bảo các đường dẫn này là chính xác
import StatsHeader from './StatsHeader';
import RatioChart from './RatioChart';
import TrendsChart from './TrendsChart';
import DetailedCards from './DetailedCards';
import { useStatsData } from './useStatsData';
import { format } from 'date-fns';

export default function StatisticsPage() {
    // 1. State tạm thời theo dõi Input của người dùng
    const [dateRange, setDateRange] = useState({
        from: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd')
    });

    // 2. State chính thức mà API lắng nghe (Chỉ cập nhật khi nút bấm)
    const [appliedRange, setAppliedRange] = useState(dateRange);

    // 3. State hiển thị lỗi validation
    const [validationError, setValidationError] = useState<string | null>(null);

    // Gọi API thống kê với tham số lọc ngày
    const { data: statsData, loading, error } = useStatsData(appliedRange);

    // Xử lý khi nút "Apply Filter" được bấm
    const handleApplyFilter = () => {
        const startDate = new Date(dateRange.from);
        const endDate = new Date(dateRange.to);

        // VALIDATION LOGIC 
        if (startDate.getTime() > endDate.getTime()) {
            setValidationError('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
            return; // Ngăn API call
        }

        // Nếu không có lỗi, reset lỗi và cập nhật state API
        setValidationError(null);
        setAppliedRange(dateRange);
    };

    // Xử lý Loading và Error toàn trang
    if (loading) {
        return <div className="min-h-screen bg-gray-50 p-6 text-center pt-20 text-blue-600 font-semibold">Đang tải dữ liệu thống kê... ⏳</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-50 p-6 text-center pt-20 text-red-600 font-semibold">Lỗi tải dữ liệu: Vui lòng kiểm tra Server Backend.</div>;
    }

    // Tạo object data để truyền xuống TrendsChart
    const trendsDataProp = { trendsData: statsData?.trendsData || [] };

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
                <button
                    onClick={handleApplyFilter} // <-- GẮN HANDLER VÀ LOGIC CHECK
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Apply Filter
                </button>
            </div>

            {/* HIỂN THỊ THÔNG BÁO LỖI */}
            {validationError && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg mb-4 font-medium">
                    ⚠️ {validationError}
                </div>
            )}

            {/* Truyền dữ liệu statsData đã được lọc xuống các Component con */}
            <StatsHeader data={statsData} />

            <div className="grid grid-cols-2 gap-6 mb-6">
                <RatioChart data={statsData} />
                <TrendsChart data={trendsDataProp} />
            </div>

            <DetailedCards data={statsData} />
        </div>
    );
};
