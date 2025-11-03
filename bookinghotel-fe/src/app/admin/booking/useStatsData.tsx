"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

// Đảm bảo PORT và PATH base là đúng
const API_BASE_URL = 'http://localhost:3636/api';

// ⭐ NEW INTERFACE: Định nghĩa TrendItem
interface TrendItem {
    month: string;
    Bookings: number;
    Cancellations: number;
}

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
    trendsData: TrendItem[];
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
                const trendsEndpoint = '/stats/trends-summary';

                // GỌI 2 API CÙNG LÚC
                const [summaryResponse, trendsResponse] = await Promise.all([
                    axios.get<StatsSummary>(`${API_BASE_URL}${endpoint}`, { params: range }),
                    axios.get<TrendItem[]>(`${API_BASE_URL}${trendsEndpoint}`, { params: range }),
                ]);

                // Gộp data lại
                setData({
                    ...summaryResponse.data,
                    trendsData: trendsResponse.data, // <-- Gộp data xu hướng
                });
            } catch (err) {
                console.error("[Stats API Error]", err);
                const errorMessage = axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : "Không thể tải dữ liệu thống kê từ Backend.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }

        // Chỉ fetch khi khoảng ngày hợp lệ
        if (range.from && range.to) {
            fetchData();
        }
    }, [range.from, range.to]);

    return { data, loading, error };
}
