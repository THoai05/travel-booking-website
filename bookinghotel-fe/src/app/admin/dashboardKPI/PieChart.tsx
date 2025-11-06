"use client";

import { useEffect, useState } from "react";
import api from "@/axios/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
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

interface KPIItem {
  date: string;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  expired: number;
}

export function CombinedBookingChart() {
  const [chartData, setChartData] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"week" | "month" | "year">("week");
  const statusColors: Record<string, string> = {
    pending: "#FBBF24",    // yellow
    confirmed: "#22C55E",  // green
    cancelled: "#EF4444",  // red
    completed: "#3B82F6",  // blue
    expired: "#9CA3AF",    // gray
  };

  useEffect(() => {
    fetchChartData(type);
  }, [type]);

  const fetchChartData = async (selectedType: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/export-data/${selectedType}`);
      const data = res.data?.data;
      const labels: string[] = res.data?.labels ?? [];

      if (!data || !labels.length) {
        setChartData([]);
        return;
      }

      const formattedData: KPIItem[] = labels.map((date, index) => ({
        date,
        pending: data.statusCount?.pending?.[index] ?? 0,
        confirmed: data.statusCount?.confirmed?.[index] ?? 0,
        cancelled: data.statusCount?.cancelled?.[index] ?? 0,
        completed: data.statusCount?.completed?.[index] ?? 0,
        expired: data.statusCount?.expired?.[index] ?? 0,
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching booking status chart:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Tổng số booking cho Pie chart
  const pieData = [
    { name: "Pending", value: chartData.reduce((sum, item) => sum + item.pending, 0), color: statusColors.pending },
    { name: "Confirmed", value: chartData.reduce((sum, item) => sum + item.confirmed, 0), color: statusColors.confirmed },
    { name: "Cancelled", value: chartData.reduce((sum, item) => sum + item.cancelled, 0), color: statusColors.cancelled },
    { name: "Completed", value: chartData.reduce((sum, item) => sum + item.completed, 0), color: statusColors.completed },
    { name: "Expired", value: chartData.reduce((sum, item) => sum + item.expired, 0), color: statusColors.expired },
  ];

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle>Booking Dashboard</CardTitle>
        <div className="flex gap-2">
          {["week", "month", "year"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t as "week" | "month" | "year")}
              className={`px-4 py-2 rounded font-medium transition ${
                type === t
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
          <div>No booking data available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stacked Bar Chart */}
            <div className="bg-white rounded p-4 shadow">
              <h3 className="text-gray-900 mb-2 font-medium">Trend by Date</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="pending" stackId="a" fill={statusColors.pending} />
                  <Bar dataKey="confirmed" stackId="a" fill={statusColors.confirmed} />
                  <Bar dataKey="cancelled" stackId="a" fill={statusColors.cancelled} />
                  <Bar dataKey="completed" stackId="a" fill={statusColors.completed} />
                  <Bar dataKey="expired" stackId="a" fill={statusColors.expired} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded p-4 shadow flex flex-col items-center justify-center">
              <h3 className="text-gray-900 mb-2 font-medium">Total by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.name}: ${entry.value}`}
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
  );
}
