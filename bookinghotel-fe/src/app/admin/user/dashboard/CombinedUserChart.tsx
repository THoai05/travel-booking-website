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

export enum ProviderLogin {
    LOCAL = 'local',
    GOOGLE = 'google',
    GITHUB = 'github'
}

interface KPIItem {
    date: string;
    created_local: number;
    created_google: number;
    created_github: number;
    updated_local: number;
    updated_google: number;
    updated_github: number;
}

export function CombinedUserChart() {
    const [chartData, setChartData] = useState<KPIItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<"week" | "month" | "year">("week");

    const providerColors: Record<string, string> = {
        created_local: "#3B82F6",
        created_google: "#6366F1",
        created_github: "#8B5CF6",
        updated_local: "#22C55E",
        updated_google: "#16A34A",
        updated_github: "#10B981",
    };

    useEffect(() => {
        fetchChartData();
    }, [type]);

    const fetchChartData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users");
            const users = res.data?.users ?? [];

            const today = new Date();
            const last10Days: string[] = [];
            for (let i = 9; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                last10Days.push(d.toISOString().split("T")[0]);
            }

            const data: KPIItem[] = last10Days.map(date => ({
                date,
                created_local: users.filter(u => u.provider === ProviderLogin.LOCAL && u.createdAt?.slice(0, 10) === date).length,
                created_google: users.filter(u => u.provider === ProviderLogin.GOOGLE && u.createdAt?.slice(0, 10) === date).length,
                created_github: users.filter(u => u.provider === ProviderLogin.GITHUB && u.createdAt?.slice(0, 10) === date).length,
                updated_local: users.filter(u => u.provider === ProviderLogin.LOCAL && u.updatedAt?.slice(0, 10) === date).length,
                updated_google: users.filter(u => u.provider === ProviderLogin.GOOGLE && u.updatedAt?.slice(0, 10) === date).length,
                updated_github: users.filter(u => u.provider === ProviderLogin.GITHUB && u.updatedAt?.slice(0, 10) === date).length,
            }));

            setChartData(data);
        } catch (error) {
            console.error("Error fetching user statistics:", error);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    // Pie chart tổng hợp tất cả provider
    // Pie chart tổng hợp tất cả provider, loại bỏ các giá trị bằng 0
    const pieData = [
        { name: "Created Local", value: chartData.reduce((sum, item) => sum + item.created_local, 0), color: providerColors.created_local },
        { name: "Created Google", value: chartData.reduce((sum, item) => sum + item.created_google, 0), color: providerColors.created_google },
        { name: "Created Github", value: chartData.reduce((sum, item) => sum + item.created_github, 0), color: providerColors.created_github },
        { name: "Updated Local", value: chartData.reduce((sum, item) => sum + item.updated_local, 0), color: providerColors.updated_local },
        { name: "Updated Google", value: chartData.reduce((sum, item) => sum + item.updated_google, 0), color: providerColors.updated_google },
        { name: "Updated Github", value: chartData.reduce((sum, item) => sum + item.updated_github, 0), color: providerColors.updated_github },
    ].filter(entry => entry.value > 0); // <- chỉ giữ các entry > 0


    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border rounded shadow">
                    <div className="font-medium mb-1">{label}</div>
                    {payload.map((entry: any, idx: number) => (
                        <div key={idx} style={{ color: entry.fill }}>
                            {entry.name}: {entry.value}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="mb-8">
            <Card className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle>User Dashboard</CardTitle>
                    {/* <div className="flex gap-2">
                        {["week", "month", "year"].map(t => (
                            <button
                                key={t}
                                onClick={() => setType(t as "week" | "month" | "year")}
                                className={`px-4 py-2 rounded font-medium transition ${type === t ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div> */}
                </CardHeader>

                <CardContent>
                    {loading ? <div>Loading...</div> : !chartData.length ? <div>No user data available.</div> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Stacked Bar Chart */}
                            <div className="bg-white rounded p-4 shadow">
                                <h3 className="text-gray-900 mb-2 font-medium">Trend by Date (Created vs Updated)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="top" height={50} wrapperStyle={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start", gap: 10, marginBottom: 5 }} />
                                        {/* Created */}
                                        <Bar dataKey="created_local" stackId="a" fill={providerColors.created_local} name="Created Local" />
                                        <Bar dataKey="created_google" stackId="a" fill={providerColors.created_google} name="Created Google" />
                                        <Bar dataKey="created_github" stackId="a" fill={providerColors.created_github} name="Created Github" />
                                        {/* Updated */}
                                        <Bar dataKey="updated_local" stackId="b" fill={providerColors.updated_local} name="Updated Local" />
                                        <Bar dataKey="updated_google" stackId="b" fill={providerColors.updated_google} name="Updated Google" />
                                        <Bar dataKey="updated_github" stackId="b" fill={providerColors.updated_github} name="Updated Github" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Pie Chart */}
                            <div className="bg-white rounded p-4 shadow flex flex-col items-center justify-center">
                                <h3 className="text-gray-900 mb-2 font-medium">Total Users by Provider</h3>
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
        </div>
    );
}
