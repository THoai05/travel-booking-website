import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    chartData: number[];
    color: string;
}

function StatCard({ title, value, change, isPositive, chartData, color }: StatCardProps) {
    const maxValue = Math.max(...chartData);

    return (
        <Card className="border-2 border-dashed border-blue-300 bg-white">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-gray-600 mb-2">{title}</p>
                        <h2 className="text-gray-900 mb-1">{value}</h2>
                        <div className="flex items-center gap-1">
                            {isPositive ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
                                {change}
                            </span>
                            <span className="text-sm text-gray-500">vs last month</span>
                        </div>
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="flex items-end justify-between h-16 gap-1">
                    {chartData.map((value, index) => {
                        const height = (value / maxValue) * 100;
                        return (
                            <div
                                key={index}
                                className="flex-1 rounded-t transition-all"
                                style={{
                                    height: `${height}%`,
                                    background: `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
                                }}
                            />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export function StatsCards() {
    return (
        <div className="grid grid-cols-3 gap-6 mb-8">
            <StatCard
                title="Total Users"
                value="12,450"
                change="12%"
                isPositive={true}
                chartData={[30, 40, 35, 50, 45, 60, 55, 70, 65, 75]}
                color="#10b981"
            />
            <StatCard
                title="Total Trips"
                value="3,210"
                change="2%"
                isPositive={false}
                chartData={[50, 45, 55, 40, 50, 35, 45, 40, 50, 45]}
                color="#ef4444"
            />
            <StatCard
                title="Active Users Today"
                value="520"
                change="2%"
                isPositive={true}
                chartData={[40, 45, 50, 55, 50, 60, 55, 65, 70, 75]}
                color="#10b981"
            />
        </div>
    );
}