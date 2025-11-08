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

export enum RoomTypeName {
  DELUXE_DOUBLE = "deluxe double",
  DELUXE_FAMILY = "deluxe family",
  GRAND_FAMILY = "grand family",
  DELUXE_TRIPLE = "deluxe triple",
  STANDARD = "standard",
  DOUBLE_ROOM = "double room",
  TRIPPLE_ROOM = "triple room",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  EXPIRED = "expired",
}

interface RoomData {
  bookingId: number;
  bookingStatus: BookingStatus;
  userId: number;
  roomTypeId: number;
  roomTypeName: RoomTypeName;
  hotelId: number;
  hotelName: string;
}

interface HotelDetail {
  hotelName: string;
  occupied: number;
  available: number;
}

interface RoomTypeStats {
  roomTypeName: RoomTypeName;
  occupied: number;
  available: number;
  hotels: HotelDetail[];
}

export function CombinedBookingChart() {
  const [chartData, setChartData] = useState<RoomTypeStats[]>([]);
  const [loading, setLoading] = useState(true);

  const [hoveredPie, setHoveredPie] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchRoomStats();
  }, []);

  const fetchRoomStats = async () => {
    try {
      setLoading(true);
      const res = await api.get<RoomData[]>("/rooms/roomAvailabilityMonitor");
      const data = res.data;

      const roomStats: Record<string, RoomTypeStats> = {};

      data.forEach((item) => {
        const key = item.roomTypeName;

        if (!roomStats[key]) {
          roomStats[key] = {
            roomTypeName: key as RoomTypeName,
            occupied: 0,
            available: 0,
            hotels: [],
          };
        }

        const isOccupied =
          item.bookingStatus === BookingStatus.PENDING ||
          item.bookingStatus === BookingStatus.CONFIRMED;

        if (isOccupied) {
          roomStats[key].occupied += 1;
        } else {
          roomStats[key].available += 1;
        }

        let hotel = roomStats[key].hotels.find(
          (h) => h.hotelName === item.hotelName
        );
        if (!hotel) {
          hotel = { hotelName: item.hotelName, occupied: 0, available: 0 };
          roomStats[key].hotels.push(hotel);
        }

        if (isOccupied) {
          hotel.occupied += 1;
        } else {
          hotel.available += 1;
        }
      });

      setChartData(Object.values(roomStats));
    } catch (error) {
      console.error("Error fetching room stats:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    {
      name: "Occupied",
      value: chartData.reduce((sum, r) => sum + r.occupied, 0),
      color: "#22C55E",
    },
    {
      name: "Available",
      value: chartData.reduce((sum, r) => sum + r.available, 0),
      color: "#3B82F6",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as RoomTypeStats;
      return (
        <div className="bg-white p-3 rounded shadow border border-gray-200">
          <strong>{data.roomTypeName}</strong>
          <div>Occupied: {data.occupied}</div>
          <div>Available: {data.available}</div>
          <hr className="my-1 border-gray-300" />
          <div className="text-sm">
            <strong>Details by Hotel:</strong>
            {data.hotels.map((h, idx) => (
              <div key={idx}>
                {h.hotelName}: Occupied {h.occupied}, Available {h.available}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + 255 * (percent / 100));
    const g = Math.min(255, ((num >> 8) & 0xff) + 255 * (percent / 100));
    const b = Math.min(255, (num & 0xff) + 255 * (percent / 100));
    return `rgb(${r},${g},${b})`;
  };

  const renderFloatingPieTooltip = () => {
    if (!hoveredPie) return null;
  
    const type = hoveredPie;
    const filteredRoomTypes = chartData.filter((r) =>
      type === "Occupied" ? r.occupied > 0 : r.available > 0
    );
  
    return (
      <div
        className="bg-white p-3 rounded shadow border border-gray-200 max-h-64 overflow-auto text-sm relative"
        style={{
          position: "fixed",
          top: mousePos.y + 10,
          left: mousePos.x + 10,
          zIndex: 9999,
          width: 300,
        }}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => {
          setTooltipVisible(false);
          setHoveredPie(null);
        }}
      >
        {/* Nút ✕ để đóng tooltip */}
        <button
          onClick={() => {
            setHoveredPie(null);
            setTooltipVisible(false);
          }}
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 text-sm font-bold"
        >
          ✕
        </button>
  
        <strong>{type} Details:</strong>
        {filteredRoomTypes.map((r, idx) => (
          <div key={idx} className="mt-1">
            <div className="font-medium">{r.roomTypeName}</div>
            {r.hotels
              .filter((h) =>
                type === "Occupied" ? h.occupied > 0 : h.available > 0
              )
              .map((h, i) => (
                <div key={i} className="ml-2">
                  {h.hotelName}: {type === "Occupied" ? h.occupied : h.available}
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  };
  

  return (
    <div className="mb-8 relative">
      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Room Availability Dashboard</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : !chartData.length ? (
            <div>No room data available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white rounded p-4 shadow">
                <h3 className="text-gray-900 mb-2 font-medium">
                  Occupied vs Available by Room Type
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="roomTypeName"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="occupied" stackId="a" fill="#22C55E" />
                    <Bar dataKey="available" stackId="a" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div
                className="bg-white rounded p-4 shadow flex flex-col items-center justify-center relative"
                onMouseLeave={() => {
                  if (!tooltipVisible) setHoveredPie(null);
                }}
              >
                <h3 className="text-gray-900 mb-2 font-medium">
                  Total Occupied vs Available
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={hoveredSliceIndex !== null ? 120 : 100} // pop-out
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      onMouseEnter={(data, index, e) => {
                        setHoveredPie(data.name);
                        setHoveredSliceIndex(index);
                        setMousePos({ x: e.clientX, y: e.clientY });
                        setTooltipVisible(true);
                      }}
                      onMouseMove={(data, index, e) => {
                        setMousePos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => {
                        if (!tooltipVisible) setHoveredPie(null);
                        setHoveredSliceIndex(null);
                      }}
                      isAnimationActive={true}
                      animationDuration={300}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#000"
                          strokeWidth={hoveredSliceIndex === index ? 2 : 0}
                          style={{
                            transition: "all 0.3s",
                          }}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </RePieChart>
                </ResponsiveContainer>

                {/* Tooltip thả nổi */}
                {renderFloatingPieTooltip()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
