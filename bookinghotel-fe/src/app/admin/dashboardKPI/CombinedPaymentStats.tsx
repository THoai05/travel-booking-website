"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart as RePieChart,
    Pie,
    Cell,
} from "recharts";

// Helper format tiền kiểu M/T
const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "T"; // tỷ
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";       // triệu
    return value.toLocaleString("vi-VN"); // dưới triệu
};

interface PaymentStats {
    date: string;
    cod: number;
    momo: number;
    vnpay: number;
    zalopay: number; // thêm mới
    stripe: number;  // thêm mới
}

export function CombinedPaymentStats() {
    const [chartData, setChartData] = useState<PaymentStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<"week" | "month" | "year">("week");

    const paymentColors: Record<string, string> = {
        cod: "#FBBF24",     // vàng nhạt
        momo: "#22C55E",    // xanh lá
        vnpay: "#3B82F6",   // xanh dương
        zalopay: "#F472B6", // hồng
        stripe: "#8B5CF6",  // tím
    };

    useEffect(() => {
        fetchChartData(type);
    }, [type]);

    const fetchChartData = async (selectedType: string) => {
        try {
            setLoading(true);
            const res = await api.get(`/bookings/payment-stats?type=${selectedType}`);
            const labels: string[] = res.data?.labels ?? [];
            const data = res.data?.paymentData;

            if (!data || !labels.length) {
                setChartData([]);
                return;
            }

            const formattedData: PaymentStats[] = labels.map((date, index) => ({
                date,
                cod: data.cod?.[index] ?? 0,
                momo: data.momo?.[index] ?? 0,
                vnpay: data.vnpay?.[index] ?? 0,
                zalopay: data.zalopay?.[index] ?? 0, // mới
                stripe: data.stripe?.[index] ?? 0,   // mới
            }));

            setChartData(formattedData);
        } catch (error) {
            console.error("Error fetching payment stats:", error);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    // Pie chart tổng
    const pieData = [
        { name: "COD", value: chartData.reduce((sum, item) => sum + item.cod, 0), color: paymentColors.cod },
        { name: "Momo", value: chartData.reduce((sum, item) => sum + item.momo, 0), color: paymentColors.momo },
        { name: "VNPay", value: chartData.reduce((sum, item) => sum + item.vnpay, 0), color: paymentColors.vnpay },
        { name: "ZaloPay", value: chartData.reduce((sum, item) => sum + item.zalopay, 0), color: paymentColors.zalopay },
        { name: "Stripe", value: chartData.reduce((sum, item) => sum + item.stripe, 0), color: paymentColors.stripe },
    ];

    return (
        <div className="mb-8">
            <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle>Payment Stats Dashboard</CardTitle>
                    <div className="flex gap-2">
                        {["week", "month", "year"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t as "week" | "month" | "year")}
                                className={`px-4 py-2 rounded font-medium transition ${type === t
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div>Loading...</div>
                    ) : !chartData.length ? (
                        <div>No payment data available.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Area Chart */}
                            <div className="bg-white rounded p-4 shadow">
                                <h3 className="text-gray-900 mb-2 font-medium">Payment Trend by Date </h3>
                                <div className="flex gap-4 mt-2 mb-4 text-sm text-gray-700">
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                        <span>M = Triệu</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                        <span>T = Tỷ</span>
                                    </div>
                                </div>

                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                                        <YAxis
                                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                                            tickFormatter={formatCurrency}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                                        />
                                        <Legend verticalAlign="top" height={50} wrapperStyle={{ display: "flex", gap: 10 }} />
                                        <Area type="monotone" dataKey="cod" stackId="1" stroke={paymentColors.cod} fill={paymentColors.cod} />
                                        <Area type="monotone" dataKey="momo" stackId="1" stroke={paymentColors.momo} fill={paymentColors.momo} />
                                        <Area type="monotone" dataKey="vnpay" stackId="1" stroke={paymentColors.vnpay} fill={paymentColors.vnpay} />
                                        <Area type="monotone" dataKey="zalopay" stackId="1" stroke={paymentColors.zalopay} fill={paymentColors.zalopay} />
                                        <Area type="monotone" dataKey="stripe" stackId="1" stroke={paymentColors.stripe} fill={paymentColors.stripe} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Pie Chart */}
                            <div className="bg-white rounded p-4 shadow flex flex-col items-center justify-center">
                                <h3 className="text-gray-900 mb-2 font-medium">Total Payments</h3>

                                <ResponsiveContainer width="100%" height={300}>
                                    <RePieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36} />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
