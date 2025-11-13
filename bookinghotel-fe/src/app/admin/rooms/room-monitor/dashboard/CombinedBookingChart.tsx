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

  // Pie hover states
  const [hoveredPie, setHoveredPie] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null);

  // Bar hover states
  const [hoveredBar, setHoveredBar] = useState<RoomTypeStats | null>(null);
  const [barTooltipVisible, setBarTooltipVisible] = useState(false);

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
        </div>
      );
    }
    return null;
  };

  // === Tooltip nổi của Pie ===
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

  // === Tooltip nổi của BarChart ===
  const renderFloatingBarTooltip = () => {
    if (!hoveredBar) return null;
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
        onMouseEnter={() => setBarTooltipVisible(true)}
        onMouseLeave={() => {
          setBarTooltipVisible(false);
          setHoveredBar(null);
        }}
      >
        <button
          onClick={() => {
            setHoveredBar(null);
            setBarTooltipVisible(false);
          }}
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 text-sm font-bold"
        >
          ✕
        </button>

        <strong>{hoveredBar.roomTypeName}</strong>
        <div>Occupied: {hoveredBar.occupied}</div>
        <div>Available: {hoveredBar.available}</div>
        <hr className="my-1 border-gray-300" />
        <strong>Details by Hotel:</strong>
        {hoveredBar.hotels.map((h, i) => (
          <div key={i}>
            {h.hotelName}: {h.occupied} occupied, {h.available} available
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
              <div className="bg-white rounded p-4 shadow relative">
                <h3 className="text-gray-900 mb-2 font-medium">
                  Occupied vs Available by Room Type
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    onMouseLeave={() => {
                      if (!barTooltipVisible) setHoveredBar(null);
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="roomTypeName"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="occupied"
                      fill="#22C55E"
                      onMouseMove={(data: any, idx: number, e: any) => {
                        setHoveredBar(data);
                        setMousePos({ x: e.clientX, y: e.clientY });
                        setBarTooltipVisible(true);
                      }}
                    />
                    <Bar
                      dataKey="available"
                      fill="#3B82F6"
                      onMouseMove={(data: any, idx: number, e: any) => {
                        setHoveredBar(data);
                        setMousePos({ x: e.clientX, y: e.clientY });
                        setBarTooltipVisible(true);
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>

                {/* Tooltip nổi của Bar */}
                {renderFloatingBarTooltip()}
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
                      outerRadius={hoveredSliceIndex !== null ? 120 : 100}
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
                          style={{ transition: "all 0.3s" }}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </RePieChart>
                </ResponsiveContainer>

                {renderFloatingPieTooltip()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
