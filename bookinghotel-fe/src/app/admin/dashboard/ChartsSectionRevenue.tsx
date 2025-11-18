"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
  PieChart, Pie, Legend
} from "recharts";
import api from "@/axios/axios";

interface RevenueDataItem {
  date: string;
  revenue: number;
  unpaidRevenue: number;
}

const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export function RevenueCharts() {
  const [data, setData] = useState<RevenueDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"week" | "month" | "year">("week");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/bookings/export-data/${type}`);
        const labels: string[] = res.data.labels;
        const raw = res.data.data;
        if (!labels || !raw) {
          setData([]);
          return;
        }
        const formatted: RevenueDataItem[] = labels.map((d: string, i: number) => ({
          date: d,
          revenue: raw.revenue?.[i] || 0,
          unpaidRevenue: raw.unpaidRevenue?.[i] || 0,
        }));
        setData(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const totalRevenue = data.reduce((acc, cur) => acc + cur.revenue, 0);
  const totalUnpaid = data.reduce((acc, cur) => acc + cur.unpaidRevenue, 0);

  // Format rút gọn kiểu K/M/B
  const formatVNDShort = (value: number) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(2).replace(/\.?0+$/, "") + "K";
    return value.toString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mb-8">
      {/* KPI Type Buttons */}
      <div className="mb-4 flex gap-2">
        {["week", "month", "year"].map(t => (
          <button
            key={t}
            className={`px-4 py-1 rounded ${type === t ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setType(t as any)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">

          {/* Bar Chart */}
          <div className="flex-1 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="unpaidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                    <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <YAxis
                  tickFormatter={formatVNDShort}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <Tooltip formatter={(v: number) => formatVND(v)} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="url(#revenueGradient)" maxBarSize={50} />
                <Bar dataKey="unpaidRevenue" radius={[6, 6, 0, 0]} fill="url(#unpaidGradient)" maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="flex-1 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Paid Revenue", value: totalRevenue },
                    { name: "Unpaid Revenue", value: totalUnpaid }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${formatVND(value)}`}
                >
                  <Cell key="paid" fill="#10b981" />
                  <Cell key="unpaid" fill="#f87171" />
                </Pie>
                <Legend />
                <Tooltip formatter={(v: number) => formatVND(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
