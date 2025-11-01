"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface RatioData {
    name: string;
    value: number;
    color: string;
}

const MOCK_RATIO: RatioData[] = [
    { name: 'Successful Bookings', value: 89.3, color: '#3b82f6' },
    { name: 'Cancellations', value: 10.7, color: '#ef4444' },
];

export default function RatioChart() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="font-semibold mb-4 text-lg">Booking vs Cancellation Ratio</h3>
            <div className="flex items-center justify-around h-64">
                <ResponsiveContainer width="45%" height="100%">
                    <PieChart>
                        <Pie
                            data={MOCK_RATIO}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            labelLine={false}
                        >
                            {MOCK_RATIO.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>

                <ul className="text-sm space-y-2">
                    {MOCK_RATIO.map((item, index) => (
                        <li key={index} className="flex items-center">
                            <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                            {item.name}: {item.value}%
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

