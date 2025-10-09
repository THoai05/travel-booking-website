import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ChartsSection() {
    const userGrowthData = [
        { month: "Jan", value: 2200 },
        { month: "Feb", value: 2800 },
        { month: "Mar", value: 3200 },
        { month: "Apr", value: 2400 },
        { month: "May", value: 2600 },
        { month: "Jun", value: 2900 },
    ];

    const tripTrendsData = [
        { category: "Beach", value: 15 },
        { category: "Cultural", value: 22 },
        { category: "City", value: 40 },
        { category: "Nature", value: 18 },
        { category: "Culinary", value: 12 },
        { category: "Relax", value: 8 },
        { category: "Adventure", value: 25 },
    ];

    return (
        <div className="mb-8">
            <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-gray-900">User Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        ticks={[0, 1000, 2000, 3000]}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="url(#colorGradient)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={60}
                                    />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Trip Trends Chart */}
                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Trip Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={tripTrendsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                                        angle={0}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        ticks={[0, 10, 30, 50]}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => `${value}%`}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={40}
                                    >
                                        {tripTrendsData.map((entry, index) => (
                                            <Bar
                                                key={`bar-${index}`}
                                                dataKey="value"
                                                fill={entry.category === "City" ? "#3b82f6" : "#dbeafe"}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
