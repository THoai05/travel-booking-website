"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueChart() {
    const data = [
        { month: "Th1", revenue: 450 },
        { month: "Th2", revenue: 480 },
        { month: "Th3", revenue: 520 },
        { month: "Th4", revenue: 610 },
        { month: "Th5", revenue: 670 },
        { month: "Th6", revenue: 700 },
    ];

    return (
        <div className="col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between mb-3">
                <h3 className="font-semibold">Biểu đồ Doanh thu</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
