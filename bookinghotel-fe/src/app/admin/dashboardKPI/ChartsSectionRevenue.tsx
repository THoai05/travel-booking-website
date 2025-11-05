"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import api from "@/axios/axios";

interface RevenueDataItem {
  date: string;
  revenue: number;
}

// Hàm format tiền VND
const formatVND = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });


const formatVNDShort = (value: number): string => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B"; // tỷ
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"; // triệu
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K"; // nghìn
  return value.toString();
};

export function ChartsSectionRevenue() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const types: ("week" | "month" | "year")[] = ["week", "month", "year"];

  const [chartData, setChartData] = useState<{
    week: RevenueDataItem[];
    month: RevenueDataItem[];
    year: RevenueDataItem[];
  }>({ week: [], month: [], year: [] });

  const [loading, setLoading] = useState(true);
  const [kpiType, setKpiType] = useState<"week" | "month" | "year">("month");

  // Drag-to-scroll
  const [dragState, setDragState] = useState({ isDragging: false, startX: 0, scrollLeft: 0 });

  // Tính width mỗi cột
  const getColumnWidth = (type: "week" | "month" | "year") => {
    switch (type) {
      case "week":
        return 160;
      case "month":
        return 37;
      case "year":
        return 90;
      default:
        return 50;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const results: any = {};
        for (const type of types) {
          const res = await api.get(`/bookings/kpiRevenue?type=${type}`);
          results[type] = res.data.data?.revenueByPeriod || [];
        }
        setChartData(results);
      } catch (err) {
        console.error("Failed to fetch revenue KPI:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setDragState({
      isDragging: true,
      startX: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    });
    scrollRef.current.style.cursor = "grabbing";
  };

  const onMouseLeaveOrUp = () => {
    if (!scrollRef.current) return;
    setDragState(prev => ({ ...prev, isDragging: false }));
    scrollRef.current.style.cursor = "grab";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.startX) * 1;
    scrollRef.current.scrollLeft = dragState.scrollLeft - walk;
  };

  const data = chartData[kpiType];
  const colWidth = getColumnWidth(kpiType);
  const chartWidth = Math.max(data.length * colWidth, 500);

  // Gradient màu từ xanh đậm -> xanh nhạt cho từng bar
  const gradientColors = [
    [16, 185, 129],  // #10b981
    [52, 211, 153],  // #34d399
    [110, 231, 183], // #6ee7b7
  ];
  const getGradientColor = (index: number) => {
    const step = index / (data.length - 1 || 1) * (gradientColors.length - 1);
    const lower = Math.floor(step);
    const upper = Math.ceil(step);
    const ratio = step - lower;

    const r = Math.round(gradientColors[lower][0] + (gradientColors[upper][0] - gradientColors[lower][0]) * ratio);
    const g = Math.round(gradientColors[lower][1] + (gradientColors[upper][1] - gradientColors[lower][1]) * ratio);
    const b = Math.round(gradientColors[lower][2] + (gradientColors[upper][2] - gradientColors[lower][2]) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-6">
          Loading revenue charts...
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Buttons chọn KPI */}
      <div className="mb-4 flex gap-2">
        {types.map(type => (
          <button
            key={type}
            className={`px-4 py-1 rounded ${kpiType === type ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setKpiType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-gray-900">{kpiType.charAt(0).toUpperCase() + kpiType.slice(1)} Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={scrollRef}
            className="overflow-x-auto cursor-grab"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeaveOrUp}
            onMouseUp={onMouseLeaveOrUp}
            onMouseMove={onMouseMove}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div style={{ minWidth: chartWidth, width: chartWidth, height: 300 }}>

              <BarChart width={chartWidth} height={300} data={data}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />   {/* xanh lá đậm */}
                    <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.6} /> {/* xanh lá nhạt */}
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={formatVNDShort} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                  formatter={(value: number) => [formatVND(value), "Revenue"]}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={getGradientColor(index)} />
                  ))}
                </Bar>
              </BarChart>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
