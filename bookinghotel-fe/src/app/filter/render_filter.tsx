"use client";

import { Star } from "lucide-react";


interface Hotel {
    id: number;
    name: string;
    price: number;
    stars: number;
    image: string;
    amenities: string[];
}

interface HotelListProps {
    hotels: Hotel[];
}

export default function HotelList({ hotels }: HotelListProps) {
    if (hotels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <span className="text-lg font-semibold">Không tìm thấy khách sạn phù hợp</span>
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
                <div
                    key={hotel.id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >

                    <h3 className="font-semibold text-lg mb-1">{hotel.name}</h3>

                    <div className="flex items-center mb-2">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>

                    <p className="text-sm text-gray-700 mb-1">
                        Giá: {hotel.price.toLocaleString()} VNĐ
                    </p>
                    <div className="text-sm text-gray-500">
                        Tiện ích: {hotel.amenities.join(", ")}
                    </div>
                </div>
            ))}
        </div>
    );
}
