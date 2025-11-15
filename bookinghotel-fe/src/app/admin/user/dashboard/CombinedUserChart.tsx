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
  ResponsiveContainer,
} from "recharts";

interface UserData {
  id: number;
  username: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

interface KPIItem {
  date: string;
  lastLogin: number;
  createdAt: number;
  updatedAt: number;
  usersInDate: UserData[];
}

export function CombinedUserChart() {
  const [chartData, setChartData] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredUsers, setHoveredUsers] = useState<UserData[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const colors = {
    lastLogin: "#3B82F6",
    createdAt: "#10B981",
    updatedAt: "#F59E0B",
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      const users: UserData[] = res.data?.users ?? [];

      const today = new Date();
      const last10Days: string[] = [];
      for (let i = 9; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        last10Days.push(d.toISOString().split("T")[0]);
      }

      const data: KPIItem[] = last10Days.map(date => {
        const usersInDate = users.filter(
          u =>
            u.lastLogin?.slice(0, 10) === date ||
            u.createdAt?.slice(0, 10) === date ||
            u.updatedAt?.slice(0, 10) === date
        );

        return {
          date,
          lastLogin: users.filter(u => u.lastLogin?.slice(0, 10) === date).length,
          createdAt: users.filter(u => u.createdAt?.slice(0, 10) === date).length,
          updatedAt: users.filter(u => u.updatedAt?.slice(0, 10) === date).length,
          usersInDate,
        };
      });

      setChartData(data);
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý hover: cập nhật danh sách users và vị trí popup
  const handleBarMouseMove = (data: KPIItem | null, e: any) => {
    if (!data || !e) {
      setShowPopup(false);
      return;
    }

    const pageX = e?.pageX ?? 0;
    const pageY = e?.pageY ?? 0;

    setHoveredUsers(data.usersInDate);
    setPopupPos({ x: pageX + 10, y: pageY + 10 });
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="mb-8 relative">
      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
        <CardHeader>
          <CardTitle>User Dashboard (Last 10 Days)</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : !chartData.length ? (
            <div>No user data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Bar
                  dataKey="lastLogin"
                  stackId="a"
                  fill={colors.lastLogin}
                  name="Last Login"
                  onMouseMove={handleBarMouseMove}
                  onMouseLeave={() => setShowPopup(false)}
                />
                <Bar
                  dataKey="createdAt"
                  stackId="a"
                  fill={colors.createdAt}
                  name="Created At"
                  onMouseMove={handleBarMouseMove}
                  onMouseLeave={() => setShowPopup(false)}
                />
                <Bar
                  dataKey="updatedAt"
                  stackId="a"
                  fill={colors.updatedAt}
                  name="Updated At"
                  onMouseMove={handleBarMouseMove}
                  onMouseLeave={() => setShowPopup(false)}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Popup hiển thị user */}
      {showPopup && hoveredUsers.length > 0 && (
        <div
          className="absolute z-50 w-80 max-h-96 overflow-auto bg-white border border-gray-300 rounded shadow-lg p-2"
          style={{
            top: isNaN(popupPos.y) ? 0 : popupPos.y,
            left: isNaN(popupPos.x) ? 0 : popupPos.x,
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Users on this day</span>
            <button
              onClick={handlePopupClose}
              className="text-red-500 font-bold text-xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="overflow-auto max-h-72">
            <table className="w-full text-sm table-fixed border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-1">Username</th>
                  <th className="p-1">Created</th>
                  <th className="p-1">Updated</th>
                  <th className="p-1">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {hoveredUsers.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="p-1">{user.username}</td>
                    <td className="p-1">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="p-1">{new Date(user.updatedAt).toLocaleString()}</td>
                    <td className="p-1">{new Date(user.lastLogin).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
