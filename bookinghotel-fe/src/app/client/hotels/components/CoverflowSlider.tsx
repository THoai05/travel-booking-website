// components/CoverflowSlider.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Import Hook
import { useHandleGetTitleCities } from "@/service/city/cityService";
import { useRouter } from "next/navigation";

// Interface
interface CityData {
  id: string | number;
  title: string;
  image: string;
  hotelCount?: number;
}

export function CoverflowSlider() {
  // 1. Gọi Hook lấy dữ liệu
  const { data: cities, isLoading, isError } = useHandleGetTitleCities();
  const router = useRouter()

  // --- RENDER LOADING STATE (Hiển thị 5 cái skeleton tượng trưng) ---
  if (isLoading) {
    return (
      <section className="w-full py-10">
        <div className="w-full max-w-[1400px] mx-auto px-4"> {/* Tăng max-w lên để chứa 5 cột */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- RENDER ERROR STATE ---
  if (isError || !cities || cities.length === 0) {
    return null;
  }

  // 2. Logic cắt lấy đúng 15 phần tử đầu tiên (3 hàng x 5 cột)
  const displayCities = cities.slice(0, 15);

  return (
    <section className="w-full py-6">
      {/* Title Section */}
      <div className="max-w-[1400px] mx-auto px-4 mb-6">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <span className="text-2xl">🗺️</span>
          Khám phá Việt Nam nào
        </h2>
      </div>

      {/* --- GRID SECTION --- */}
      <div className="w-full max-w-[1400px] mx-auto px-4">
        
        {/* GRID SYSTEM:
            - grid-cols-1: Mobile 1 cột
            - sm:grid-cols-2: Mobile to 2 cột
            - md:grid-cols-3: Tablet 3 cột
            - lg:grid-cols-5: Desktop 5 cột (Đúng yêu cầu của bro)
            - gap-4: Khoảng cách giữa các ô
         */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {displayCities.map((city: CityData) => (
            <div key={city.id} className="h-full">
              <Card className="border-none shadow-none bg-transparent h-full">
                <CardContent onClick={() => {
                  router.push(`hotels/search?cityTitle=${city.title}`)
                }}
                  className="relative aspect-[16/9] p-0 overflow-hidden rounded-xl group cursor-pointer">
                  
                  {/* 1. Background Image */}
                  <Image
                    src={city.image || "/images/default-city.jpg"}
                    alt={city.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw" // Tối ưu size ảnh cho Grid 5 cột
                  />

                  {/* 2. Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* 3. Text Content (Góc trên trái) */}
                  <div className="absolute top-0 left-0 p-4 w-full">
                    <h3 className="text-lg font-bold text-white drop-shadow-md tracking-wide truncate">
                      {city.title}
                    </h3>
                    {city.hotelCount && (
                       <p className="text-xs text-white/90 font-medium mt-1 drop-shadow-sm">
                         {city.hotelCount} địa điểm
                       </p>
                    )}
                  </div>

                </CardContent>
              </Card>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}