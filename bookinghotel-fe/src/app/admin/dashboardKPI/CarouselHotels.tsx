"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import api from "@/axios/axios";
import { motion, AnimatePresence } from "framer-motion";

interface Hotel {
    hotelId: number;
    hotelName: string;
    cityImage: string;
    hotelAddress: string;
    totalRevenue: number;
    totalBookings: number;
    description: string;
}

function HotelCard({
    hotel,
    handleHotelHover,
    setHoveredHotelDetail,
}: {
    hotel: Hotel;
    handleHotelHover: (hotelId: number) => Promise<void>;
    setHoveredHotelDetail: (detail: any) => void;
}) {
    return (
        <div className="border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
            {/* Hình ảnh khách sạn */}
            <div
                className="relative h-52 md:h-48 overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-500"
                onMouseEnter={() => handleHotelHover(hotel.hotelId)} // 👈 thêm ở đây
                onMouseLeave={() => setHoveredHotelDetail(null)}     // 👈 thêm ở đây
            >
                <Image
                    src={hotel.cityImage}
                    alt={hotel.hotelName}
                    fill
                    className="object-cover transform transition-transform duration-700 ease-out hover:scale-110 hover:rotate-1 hover:brightness-110"
                />
                {/* Doanh thu */}
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md">
                    <span className="text-gray-900 font-semibold text-sm">
                        {hotel.totalRevenue.toLocaleString()}₫
                    </span>
                </div>
            </div>

            {/* Nội dung */}
            <div className="p-4 flex flex-col justify-between h-full">
                <div className="mb-3">
                    <h3 className="text-gray-900 font-semibold text-lg truncate">
                        {hotel.hotelName}
                    </h3>

                    {/* ❌ Bỏ onMouseEnter/Leave ở đây */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
                        <span className="text-blue-500">📌</span>
                        <span className="truncate">{hotel.hotelAddress}</span>
                    </div>

                    <p className="text-sm text-gray-600 leading-snug mt-1">
                        📝{" "}
                        {hotel.description.length > 200
                            ? hotel.description.substring(0, 200) + "..."
                            : hotel.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function CarouselHotels() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredHotelDetail, setHoveredHotelDetail] = useState<any>(null);
    const hotelDetailCache = useRef<Map<number, any>>(new Map());
    const SLIDE_SIZE = 4;

    const formatVND = (amount: number | string) => {
        const num = typeof amount === "string" ? parseFloat(amount) : amount;
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(num);
    };

    const handleHotelHover = async (hotelId: number) => {
        if (hotelDetailCache.current.has(hotelId)) {
            setHoveredHotelDetail(hotelDetailCache.current.get(hotelId));
            return;
        }
        try {
            const res = await api.get(`/rooms/hotelDetail/${hotelId}`);
            hotelDetailCache.current.set(hotelId, res.data);
            setHoveredHotelDetail(res.data);
        } catch {
            console.error("Không lấy được chi tiết khách sạn");
        }
    };

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await api.get("/bookings/revenue-by-hotel");
                const sorted = res.data.sort(
                    (a: Hotel, b: Hotel) => b.totalRevenue - a.totalRevenue
                );
                setHotels(sorted);
            } catch (error) {
                console.error(error);
            }
        };
        fetchHotels();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) =>
                hotels.length ? (prev + 1) % Math.ceil(hotels.length / SLIDE_SIZE) : 0
            );
        }, 8000);
        return () => clearInterval(interval);
    }, [hotels]);

    const totalSlides = Math.ceil(hotels.length / SLIDE_SIZE);

    const slideVariants = {
        enter: { x: "100%", opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 },
    };

    return (
        <div className="mb-8">
            <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-6">
                <h2 className="text-gray-900 mb-4">Trips</h2>
                <div className="relative overflow-hidden">
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={currentSlide}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            {hotels
                                .slice(currentSlide * SLIDE_SIZE, currentSlide * SLIDE_SIZE + SLIDE_SIZE)
                                .map((hotel) => (
                                    <HotelCard
                                        key={hotel.hotelId}
                                        hotel={hotel}
                                        handleHotelHover={handleHotelHover}
                                        setHoveredHotelDetail={setHoveredHotelDetail}
                                    />
                                ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                            <span
                                key={idx}
                                className={`w-3 h-3 rounded-full cursor-pointer ${idx === currentSlide ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                                onClick={() => setCurrentSlide(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Hover Detail */}
            {hoveredHotelDetail && (
                <div className="fixed top-20 left-10 p-4 bg-white border rounded shadow-lg w-64 z-50">
                    <h3 className="font-bold flex items-start gap-2">
                        📌 <span className="leading-tight">Hotel: {hoveredHotelDetail.name}</span>
                    </h3>
                    <p className="flex items-start gap-2">
                        🏠 <span className="leading-tight">Address: {hoveredHotelDetail.address}</span>
                    </p>
                    <p className="flex items-start gap-2">
                        📞 <span className="leading-tight">Phone: {hoveredHotelDetail.phone}</span>
                    </p>
                    <p className="flex items-start gap-2">
                        ℹ️{" "}
                        <span className="leading-tight">
                            Description: {hoveredHotelDetail.description}
                        </span>
                    </p>
                    <p className="flex items-start gap-2">
                        💰{" "}
                        <span className="leading-tight">
                            Avg Price: {formatVND(hoveredHotelDetail.avgPrice)}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
