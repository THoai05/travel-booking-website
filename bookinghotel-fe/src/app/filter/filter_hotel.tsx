"use client";

import { useState } from "react";
import HotelList from "./render_filter";
import { Star } from "lucide-react";
import { useEffect } from "react";
import { Wifi, Utensils, Waves, Coffee, Building2 } from "lucide-react";
import { Search } from "lucide-react";




export default function HotelFilterContainer() {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [stars, setStars] = useState<number[]>([]);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [hotels, setHotels] = useState<any[]>([]);


    const fakeHotels = [
        {
            id: 1, name: "Khách sạn Biển Xanh", price: 800000, stars: 4, amenities: ["Wifi miễn phí", "Hồ bơi"]
        },
        { id: 2, name: "Khách sạn Ánh Dương", price: 1200000, stars: 5, amenities: ["Nhà hàng", "Bữa sáng"] },
        { id: 3, name: "Khách sạn Phố Cổ", price: 500000, stars: 3, amenities: ["Wifi miễn phí"] },
        { id: 4, name: "Khách sạn Núi Xanh", price: 700000, stars: 4, amenities: ["Hồ bơi", "Gần biển"] },
        { id: 5, name: "Khách sạn Thành Phố", price: 600000, stars: 3, amenities: ["Wifi miễn phí", "Nhà hàng"] },
    ];

    const STAR_OPTIONS = [1, 2, 3, 4, 5];
    const AMENITY_OPTIONS = [
        { name: "Wifi miễn phí", icon: <Wifi size={16} /> },    
        { name: "Hồ bơi", icon: <Waves size={16} /> },
        { name: "Bữa sáng", icon: <Coffee size={16} /> },
        { name: "Gần biển", icon: <Building2 size={16} /> },
        { name: "Nhà hàng", icon: <Utensils size={16} /> },
    ];


    const toggleStar = (s: number) =>
        setStars((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

    const toggleAmenity = (a: string) =>
        setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

    const applyFilter = () => {
        const filtered = fakeHotels.filter(
            (hotel) =>
                hotel.price >= minPrice &&
                hotel.price <= maxPrice &&
                (stars.length === 0 || stars.includes(hotel.stars)) &&
                (amenities.length === 0 ||
                    amenities.every((a) => hotel.amenities.includes(a)))
        );
        setHotels(filtered);    
    };

    return (
        <div className="flex gap-6 flex-col lg:flex-row ">   
            {/* Bộ lọc */}
            <div className=" sm:w-full lg:w-1/4 bg-white p-4 shadow">
                <h2 className="font-semibold mb-2">Bộ lọc nâng cao</h2>

                {/* Giá */}
                <div className="mb-4">
                    <label className="block text-sm mb-1">Khoảng giá (VNĐ)</label>
                    <div className="flex ">
                        <input
                            type="number"
                            className="border p-1 w-full mb-1 rounded-sm mr-2"
                            value={minPrice}
                            onChange={(e) => setMinPrice(+e.target.value)}
                        />
                        <input
                            type="number"
                            className="border p-1 w-full mb-1 rounded-sm"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(+e.target.value)}
                        />
                    </div>

                </div>

                <div className="sm:flex sm:gap-6 lg:block ">
                    {/* Sao */}
                <div className="mb-4">
                    <label className="block text-sm mb-1">Hạng sao</label>
                    {STAR_OPTIONS.map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer mb-4">
                            <input type="checkbox" checked={stars.includes(s)} onChange={() => toggleStar(s)} />
                            <div className="flex items-center text-yellow-400">
                                {[...Array(s)].map((_, i) => (
                                    <Star key={i} size={16} fill="#facc15" stroke="none" />
                                ))}
                                <span className="ml-2 text-gray-700">{s} sao</span>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Tiện ích */}
                <div className="mb-4">
                    <label className="block text-sm mb-1">Tiện ích phổ biến</label>
                    {AMENITY_OPTIONS.map(({ name, icon }) => (
                        <label key={name} className="flex items-center gap-2 cursor-pointer mb-4">
                            <input
                                type="checkbox"
                                checked={amenities.includes(name)}
                                onChange={() => toggleAmenity(name)}

                            />
                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-blue-300">{icon}</span>
                                <span>{name}</span>
                            </div>
                        </label>
                    ))}
                    </div>   
                </div>


                <button
                    onClick={applyFilter}
                    className="bg-blue-400 text-white w-full py-2 rounded hover:bg-blue-300"
                >
                    <Search className="inline-block mr-2 mb-1" size={20} />
                    Áp dụng bộ lọc
                </button>
            </div>

            {/* Danh sách khách sạn */}
            <div className="flex-1">
                <HotelList hotels={hotels} />
            </div>
        </div>
    );
}
