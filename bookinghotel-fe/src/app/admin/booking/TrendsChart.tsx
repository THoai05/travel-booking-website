"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

interface TrendData {
    month: string;
    Bookings: number;
    Cancellations: number;
}

const MOCK_TRENDS: TrendData[] = [
    { month: 'Jan', Bookings: 450, Cancellations: 80 }, { month: 'Feb', Bookings: 480, Cancellations: 90 },
    { month: 'Mar', Bookings: 550, Cancellations: 70 }, { month: 'Apr', Bookings: 610, Cancellations: 100 },
    { month: 'May', Bookings: 580, Cancellations: 110 }, { month: 'Jun', Bookings: 540, Cancellations: 120 },
    { month: 'Jul', Bookings: 650, Cancellations: 90 }, { month: 'Aug', Bookings: 600, Cancellations: 110 },
    { month: 'Sep', Bookings: 520, Cancellations: 80 }, { month: 'Oct', Bookings: 490, Cancellations: 75 },
    { month: 'Nov', Bookings: 510, Cancellations: 85 }, { month: 'Dec', Bookings: 470, Cancellations: 70 },
];

export default function TrendsChart() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="font-semibold mb-4 text-lg">Booking Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={256}>
                <LineChart data={MOCK_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Bookings" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Cancellations" stroke="#ef4444" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

    