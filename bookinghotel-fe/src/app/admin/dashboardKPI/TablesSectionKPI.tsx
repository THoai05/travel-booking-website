"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPIItem {
    date: string;
    totalBookings: number;
    cancelledBookings: number;
    revenue: number;
    status: Record<string, number>;
}

export function TablesSectionKPI() {
    const [kpiData, setKpiData] = useState<KPIItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<"week" | "month" | "year">("week");

    useEffect(() => {
        fetchKPI(type);
    }, [type]);

    const fetchKPI = async (selectedType: string) => {
        try {
            setLoading(true);
            const res = await api.get(`/bookings/export-data/${selectedType}`);
            const data = res.data?.data;
            const labels: string[] = res.data?.labels ?? [];

            if (!data || !labels.length) {
                setKpiData([]);
                return;
            }

            const formattedData: KPIItem[] = labels.map((date, index) => ({
                date,
                totalBookings: data.totalBookings?.[index] ?? 0,
                cancelledBookings: data.cancelledBookings?.[index] ?? 0,
                revenue: data.revenue?.[index] ?? 0,
                status: {
                    pending: data.statusCount?.pending?.[index] ?? 0,
                    confirmed: data.statusCount?.confirmed?.[index] ?? 0,
                    cancelled: data.statusCount?.cancelled?.[index] ?? 0,
                    completed: data.statusCount?.completed?.[index] ?? 0,
                    expired: data.statusCount?.expired?.[index] ?? 0,
                },
            }));

            setKpiData(formattedData);
        } catch (error) {
            console.error("Error fetching KPI data:", error);
            setKpiData([]);
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = () => {
        if (!kpiData.length) return;

        const worksheetData = kpiData.map((item) => ({
            Date: item.date,
            "Total Bookings": item.totalBookings,
            "Cancelled Bookings": item.cancelledBookings,
            Revenue: item.revenue,
            Pending: item.status.pending,
            Confirmed: item.status.confirmed,
            Cancelled: item.status.cancelled,
            Completed: item.status.completed,
            Expired: item.status.expired,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "KPI");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, `KPI_${type}.xlsx`);
    };

    return (
        <Card className="p-4">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>KPI Dashboard</CardTitle>

                <div className="flex gap-2 items-center">
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


                    <button
                        onClick={exportExcel}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Export Excel
                    </button>
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div>Loading...</div>
                ) : !kpiData.length ? (
                    <div>No KPI data available.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2 text-left">Date</th>
                                    <th className="border p-2 text-left">Total Bookings</th>
                                    <th className="border p-2 text-left">Cancelled</th>
                                    <th className="border p-2 text-left">Revenue</th>
                                    <th className="border p-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kpiData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="border p-2">{item.date}</td>
                                        <td className="border p-2">{item.totalBookings}</td>
                                        <td className="border p-2">{item.cancelledBookings}</td>
                                        <td className="border p-2 font-semibold text-green-700">
                                            {item.revenue.toLocaleString("vi-VN")} ₫
                                        </td>
                                        <td className="border p-2 flex gap-1 flex-wrap">
                                            {Object.entries(item.status).map(
                                                ([status, value]) =>
                                                    value > 0 && (
                                                        <span
                                                            key={status}
                                                            className={`px-2 py-1 rounded text-xs ${status === "pending"
                                                                    ? "bg-yellow-200 text-yellow-800"
                                                                    : status === "confirmed"
                                                                        ? "bg-green-200 text-green-800"
                                                                        : status === "cancelled"
                                                                            ? "bg-red-200 text-red-800"
                                                                            : status === "completed"
                                                                                ? "bg-blue-200 text-blue-800"
                                                                                : "bg-gray-200 text-gray-800"
                                                                }`}
                                                        >
                                                            {status}: {value}
                                                        </span>
                                                    )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
