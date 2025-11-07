"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
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

function HotelCard({ hotel }: { hotel: Hotel }) {
    return (
        <div className="border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
            {/* Hình ảnh khách sạn */}
            <div className="relative h-52 md:h-48 overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-500">
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
                {/* Tiêu đề và địa chỉ */}
                <div className="mb-3">
                    <h3 className="text-gray-900 font-semibold text-lg truncate">{hotel.hotelName}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
                        <span className="text-blue-500">📌</span>
                        <span className="truncate">{hotel.hotelAddress}</span>
                    </div>

                    <p className="text-sm text-gray-600 leading-snug mt-1">
                        📝 {hotel.description.length > 200
                            ? hotel.description.substring(0, 200) + "..."
                            : hotel.description}
                    </p>
                </div>
                {/* Mô tả */}

            </div>
        </div>

    );
}

export function CarouselHotels() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const SLIDE_SIZE = 4;

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await api.get("/bookings/revenue-by-hotel");
                const sorted = res.data.sort((a: Hotel, b: Hotel) => b.totalRevenue - a.totalRevenue);
                setHotels(sorted);
            } catch (error) {
                console.error(error);
            }
        };
        fetchHotels();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev =>
                hotels.length ? (prev + 1) % Math.ceil(hotels.length / SLIDE_SIZE) : 0
            );
        }, 8000);
        return () => clearInterval(interval);
    }, [hotels]);

    const totalSlides = Math.ceil(hotels.length / SLIDE_SIZE);

    // Animation variants
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
                                .map(hotel => (
                                    <HotelCard key={hotel.hotelId} hotel={hotel} />
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
        </div>
    );
}
