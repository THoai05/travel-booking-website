"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/axios/axios";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    chartData: number[];
    color: string;
}

function StatCard({ title, value, change, chartData, color }: StatCardProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const maxValue = Math.max(...chartData) || 1;
    const changeValue = parseFloat(change.replace("%", ""));
    const isPositive = changeValue >= 0;

    return (
        <Card className="border-2 border-dashed border-blue-300 bg-white relative">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-gray-600 mb-2">{title}</p>
                        <h2 className="text-gray-900 mb-1">{value}</h2>
                        <div className="flex items-center gap-1">
                            {isPositive ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
                                {change}
                            </span>
                            <span className="text-sm text-gray-500">vs last period</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between h-16 gap-1 relative">
                    {chartData.map((val, index) => {
                        const height = (val / maxValue) * 100;
                        return (
                            <div
                                key={index}
                                className="flex-1 rounded-t transition-all relative cursor-pointer"
                                style={{
                                    height: `${height}%`,
                                    background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {hoveredIndex === index && (
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg z-10">
                                        {val.toLocaleString("vi-VN")}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export function StatsCards() {
    const [stats, setStats] = useState<{
        bookings: { total: number; changeRate: number; chartData: number[] };
        cancelled: { total: number; changeRate: number; chartData: number[] };
        revenue: { total: number; changeRate: number; chartData: number[] };
    } | null>(null);

    const [kpiType, setKpiType] = useState<"week" | "month" | "year">("week");

    const fetchStats = async () => {
        try {
            const resStats = await api.get(`/bookings/kpiAll?type=${kpiType}`);
            setStats(resStats.data.data);
        } catch (error) {
            console.error("Failed to fetch KPI:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [kpiType]);

    if (!stats) {
        return <div className="grid grid-cols-3 gap-6 mb-8">Loading...</div>;
    }

    return (
        <div>
            {/* Select Week/Month/Year */}
            <div className="mb-4 flex gap-2">
                {["week", "month", "year"].map((type) => (
                    <button
                        key={type}
                        className={`px-4 py-1 rounded ${kpiType === type ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setKpiType(type as "week" | "month" | "year")}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Bookings"
                    value={stats.bookings.total.toLocaleString("vi-VN")}
                    change={`${stats.bookings.changeRate.toFixed(1)}%`}
                    chartData={stats.bookings.chartData}
                    color="#10b981"
                />
                <StatCard
                    title="Cancelled"
                    value={stats.cancelled.total.toLocaleString("vi-VN")}
                    change={`${stats.cancelled.changeRate.toFixed(1)}%`}
                    chartData={stats.cancelled.chartData}
                    color="#ef4444"
                />
                <StatCard
                    title="Revenue"
                    value={stats.revenue.total.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    change={`${stats.revenue.changeRate.toFixed(1)}%`}
                    chartData={stats.revenue.chartData}
                    color="#3b82f6"
                />
            </div>
        </div>
    );
}
