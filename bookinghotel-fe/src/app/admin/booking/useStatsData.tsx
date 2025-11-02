"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

// Đảm bảo PORT và PATH base là đúng
const API_BASE_URL = 'http://localhost:3636/api';

// Khai báo Interface cho dữ liệu trả về từ BE
interface StatsSummary {
    totalBookings: string;
    totalCancellations: string;
    occupancyRate: string;
    changeBookings: string; 
    changeCancellations: string;
    ratioSuccessful: number;
    ratioCancelled: number;
    avgDailyBookings: string;
    totalRevenue: string;
    // ... Thêm các trường khác nếu cần
}

interface DateRange {
    from: string;
    to: string;
}

export function useStatsData(range: DateRange) {
    const [data, setData] = useState<StatsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const endpoint = '/stats/summary';
                const url = `${API_BASE_URL}${endpoint}`;

                // Gửi request với tham số ngày tháng
                const response = await axios.get<StatsSummary>(url, {
                    params: {
                        from: range.from,
                        to: range.to
                    }
                });

                setData(response.data);
            } catch (err) {
                console.error("[Stats API Error]", err);
                setError("Không thể tải dữ liệu thống kê từ Backend.");
            } finally {
                setLoading(false);
            }
        }

        // Chỉ fetch khi khoảng ngày hợp lệ
        if (range.from && range.to) {
            fetchData();
        }
    }, [range.from, range.to]); // Re-fetch khi ngày bắt đầu/kết thúc thay đổi

    return { data, loading, error };
}
