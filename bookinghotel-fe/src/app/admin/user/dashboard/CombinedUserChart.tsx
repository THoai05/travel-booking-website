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

  // State mới: Lưu ngày đang hover để filter chính xác (tương tự biến "now" bạn muốn)
  const [hoveredDate, setHoveredDate] = useState<string>("");

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

  const handleBarMouseEnter = (data: KPIItem | null) => {
    if (!data) return;
    setHoveredUsers(data.usersInDate);
    setHoveredDate(data.date); // LƯU GIÁ TRỊ NGÀY HIỆN TẠI (NOW)
    setShowPopup(true);
  };

  const handlePopupClose = () => setShowPopup(false);

  return (
    <div className="mb-8 relative">
      <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
        <CardHeader>
          <CardTitle>User Dashboard (Last 10 Days)</CardTitle>
        </CardHeader>

        <CardContent className="relative">
          {loading ? (
            <div>Loading...</div>
          ) : !chartData.length ? (
            <div>No user data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                {["lastLogin", "createdAt", "updatedAt"].map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={(colors as any)[key]}
                    name={key}
                    minPointSize={1}
                    cursor="pointer"
                    isAnimationActive={false}
                    onMouseEnter={(e) => handleBarMouseEnter(e.payload)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Popup fixed trên màn hình, không đè layout, nổi trên mọi thứ */}
          {showPopup && hoveredUsers.length > 0 && (
            <div className="fixed top-5 right-5 z-50 w-150 max-h-[100vh] overflow-auto bg-white border border-gray-300 rounded shadow-lg p-4">
              <div className="flex justify-between items-center mb-2">
                {/* Hiển thị thêm ngày cho rõ ràng */}
                <span className="font-medium">Users on {hoveredDate}</span>
                {/* <span className="font-medium">Users on this day</span> */}
                <button
                  onClick={handlePopupClose}
                  className="text-red-500 font-bold text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="overflow-auto max-h-72">
                <table className="w-full text-sm border-collapse">
                  {/* Header: Thêm px-4 py-2 để tiêu đề thoáng hơn */}
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Username</th>
                      <th className="px-4 py-2 text-green-700 font-semibold whitespace-nowrap">Created</th>
                      <th className="px-4 py-2 text-yellow-700 font-semibold whitespace-nowrap">Updated</th>
                      <th className="px-4 py-2 text-blue-700 font-semibold whitespace-nowrap">Last Login</th>
                    </tr>
                  </thead>

                  <tbody>
                    {hoveredUsers.map((user) => {
                      const isCreatedMatch = user.createdAt?.slice(0, 10) === hoveredDate;
                      const isUpdatedMatch = user.updatedAt?.slice(0, 10) === hoveredDate;
                      const isLoginMatch = user.lastLogin?.slice(0, 10) === hoveredDate;

                      return (
                        <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                          {/* Username */}
                          <td className="px-4 py-2 text-gray-700 font-medium">
                            {user.username}
                          </td>

                          {/* Created: Thêm whitespace-nowrap để ngày không bị xuống dòng */}
                          <td
                            className={`px-4 py-2 whitespace-nowrap ${isCreatedMatch ? "text-green-700 font-bold bg-green-50" : "text-black"
                              }`}
                          >
                            {new Date(user.createdAt).toLocaleString()}
                          </td>

                          {/* Updated */}
                          <td
                            className={`px-4 py-2 whitespace-nowrap ${isUpdatedMatch ? "text-yellow-700 font-bold bg-yellow-50" : "text-black"
                              }`}
                          >
                            {new Date(user.updatedAt).toLocaleString()}
                          </td>

                          {/* Last Login */}
                          <td
                            className={`px-4 py-2 whitespace-nowrap ${isLoginMatch ? "text-blue-700 font-bold bg-blue-50" : "text-black"
                              }`}
                          >
                            {new Date(user.lastLogin).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Footer Total: Căn chỉnh padding giống hệt body để thẳng hàng */}
                  <tfoot className="bg-gray-100 border-t sticky bottom-0 font-bold">
                    <tr>
                      <td className="px-4 py-2">Total Match</td>
                      <td className="px-4 py-2 text-green-700">
                        {hoveredUsers.filter((u) => u.createdAt?.slice(0, 10) === hoveredDate).length}
                      </td>
                      <td className="px-4 py-2 text-yellow-700">
                        {hoveredUsers.filter((u) => u.updatedAt?.slice(0, 10) === hoveredDate).length}
                      </td>
                      <td className="px-4 py-2 text-blue-700">
                        {hoveredUsers.filter((u) => u.lastLogin?.slice(0, 10) === hoveredDate).length}
                      </td>
                    </tr>
                  </tfoot>

                </table>
              </div>
            </div>
          )}



        </CardContent>
      </Card>
    </div>
  );
}
