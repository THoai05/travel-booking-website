"use client";
import { Star, MapPin, Check } from "lucide-react";
import Image from "next/image";

export interface Accommodation {
    favouriteId: number; // id của favourite để xóa
    id: number;          // id của hotel/room
    name: string;
    address: string;
    avgPrice: number;
    phone: string;
    city: {
        id: number;
        title: string;
    };
    avgRating: number;
    reviewCount: number;
    imageUrl?: string;
}

interface AccommodationCardProps {
    accommodation: Accommodation;
    onRemove?: (favouriteId: number) => void;
}

export default function AccommodationCard({ accommodation, onRemove }: AccommodationCardProps) {
    const rating = Number((accommodation.avgRating * 2).toFixed(1));
    const defaultImage =
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYxMTg3NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080";

    return (
        <div className="flex w-200 max-w-3xl bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative">
            {/* Image */}
            <div className="w-40 h-40 flex-shrink-0 relative">
                <Image
                    src={accommodation.imageUrl || defaultImage}
                    alt={accommodation.name}
                    width={160}
                    height={160}
                    className="border border-lg rounded-xl m-2 w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-4 flex-1">
                <p className="text-sm text-gray-500 mb-1">Khách sạn</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-sky-600 transition-colors">
                    {accommodation.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                        ))}
                    </div>
                    <span className="text-sky-600 font-medium">{rating} / 10</span>
                    <span className="text-gray-500 text-sm">({accommodation.reviewCount})</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="text-sm">{accommodation.city.title}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-orange-600 text-lg font-semibold">
                        {Number(accommodation.avgPrice).toLocaleString("vi-VN")}
                    </span>
                    <span className="text-gray-500 text-sm">VND</span>
                    <span className="text-gray-600 text-sm">(1 khách, 1 phòng, 1 đêm)</span>
                </div>
            </div>

            {/* Check icon (click để xóa favourite) */}
            <div
                className="absolute top-3 right-3 bg-sky-500 p-1.5 rounded-md cursor-pointer"
                onClick={() => onRemove && onRemove(accommodation.favouriteId)}
            >
                <Check className="w-4 h-4 text-white" />
            </div>
        </div>
    );
}
