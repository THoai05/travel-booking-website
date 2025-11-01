"use client";
import React from 'react';
import { TrendingUp, TrendingDown, Clock, LucideIcon } from 'lucide-react';

interface StatItem {
    label: string;
    value: string;
    change: string;
    color: string;
    icon: LucideIcon;
}

const MOCK_STATS: StatItem[] = [
    { label: "Total Bookings", value: "2,847", change: "+2.5%", color: "text-green-600", icon: TrendingUp },
    { label: "Total Cancellations", value: "342", change: "-4.2%", color: "text-red-600", icon: TrendingDown },
    { label: "Occupancy Rate", value: "87.9%", change: "+5.1%", color: "text-blue-600", icon: Clock },
];

export default function StatsHeader() {
    return (
        <div className="grid grid-cols-3 gap-6 mb-6">
            {MOCK_STATS.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
                            <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                        </div>
                        <stat.icon className={`w-8 h-8 p-1.5 rounded-full ${stat.color} bg-opacity-10 bg-current`} />
                    </div>
                </div>
            ))}
        </div>
    );
};
