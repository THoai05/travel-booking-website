"use client";
import React from 'react';

interface DetailItem {
    label: string;
    value: string;
    unit?: string;
}

const MOCK_DETAILS: DetailItem[] = [
    { label: "Avg Daily Bookings", value: "156" },
    { label: "Total Revenue", value: "$425,890" },
    { label: "Avg Stay Duration", value: "2.3", unit: " days" },
    { label: "Customer Rating", value: "4.7/5" },
];

export default function DetailedCards() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="font-semibold mb-4 text-lg">Detailed Statistics</h3>
            <div className="grid grid-cols-4 gap-6">
                {MOCK_DETAILS.map((detail, index) => (
                    <div key={index} className="text-center p-4 border rounded-xl">
                        <h2 className="text-3xl font-bold text-blue-600">{detail.value}</h2>
                        <p className="text-gray-500 text-sm mt-1">{detail.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
