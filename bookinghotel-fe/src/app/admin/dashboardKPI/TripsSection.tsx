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
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="relative h-48">
        <Image src={hotel.cityImage} alt={hotel.hotelName} fill className="object-cover" />
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow">
          <span className="text-gray-900">{hotel.totalRevenue.toLocaleString()}₫</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-gray-900 mb-2">{hotel.hotelName}</h3>
        <div className="flex items-center gap-1 text-gray-500 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{hotel.hotelAddress}</span>
        </div>
        <p className="text-sm text-gray-600">{hotel.description}</p>
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
    }, 4500);
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
            className={`w-3 h-3 rounded-full cursor-pointer ${
              idx === currentSlide ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}
