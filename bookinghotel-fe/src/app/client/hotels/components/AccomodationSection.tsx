'use client';

import React, { useState,useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import AccommodationCard from './card/AccommodationCard';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useHandleGetTitleCities } from '@/service/city/cityService';
import { useHandleGetHotelsByRegionId, useHandleSimilarHotelByCityId } from '@/service/hotels/hotelService';
import { useRouter } from 'next/navigation';

interface AccommodationSectionProps {
  /** Section title – e.g. "Chơi cuối tuần gần nhà" */
  title: string;
  isDisplayNavbar: boolean,
  regionId?: number
  icon?: React.ReactNode; // <-- 🔥 THÊM DÒNG NÀY
}

/* -------------------------------------------------------------------------- */
/*                           SKELETON UI "XỊN"                             */
/* -------------------------------------------------------------------------- */

/** Skeleton cho cái tab city */
function SkeletonTab() {
  return (
    <div className="w-24 h-9 px-4 py-2 rounded-full bg-gray-200 animate-pulse"></div>
  );
}

/** Skeleton cho cái card khách sạn */
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 snap-center w-72 space-y-3">
      {/* Skeleton cho image */}
      <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="space-y-2 px-1">
        {/* Skeleton cho title */}
        <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
        {/* Skeleton cho address */}
        <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/*                           MAIN SECTION COMPONENT                           */
/* -------------------------------------------------------------------------- */
export default function AccommodationSection({
  title,
  isDisplayNavbar,
  regionId,
  icon
}: AccommodationSectionProps) {

  const [activeCity, setActiveCity] = useState(null);

  // --- LOGIC GỌI DATA ---
  // 1. Hook cho city tabs (chỉ chạy khi isDisplayNavbar = true)
  const { 
    data: dataCity, 
    isError: isErrorDataCity, 
    isLoading: isLoadingDataCity 
  } = useHandleGetTitleCities(isDisplayNavbar);
  
  // 2. Hook cho hotel theo city (chỉ chạy khi isDisplayNavbar = true và activeCity có id)
  const { 
    data: dataHotelsByCity, 
    isLoading: isLoadingHotelsByCity, 
    isError: isErrorHotelsByCity 
  } = useHandleSimilarHotelByCityId(isDisplayNavbar ? activeCity?.id : undefined);
  
  // 3. Hook cho hotel theo region (chỉ chạy khi isDisplayNavbar = false và regionId có)
  const { 
    data: dataHotelsByRegion, 
    isLoading: isLoadingHotelsByRegion, 
    isError: isErrorHotelsByRegion 
  } = useHandleGetHotelsByRegionId(!isDisplayNavbar ? regionId : undefined);

  // --- TỔNG HỢP DATA VÀ LOADING STATE ---
  // Thống nhất 1 state loading cho carousel
  const isLoadingCarousel = isDisplayNavbar ? isLoadingHotelsByCity : isLoadingHotelsByRegion;
  // Thống nhất 1 data source cho carousel
  const hotelsToShow = isDisplayNavbar ? dataHotelsByCity : dataHotelsByRegion;
  // Thống nhất 1 state error cho carousel
  const isErrorCarousel = isDisplayNavbar ? isErrorHotelsByCity : isErrorHotelsByRegion;

  // useEffect để auto-select city đầu tiên (giữ nguyên)
  useEffect(() => {
    if (dataCity && dataCity.length > 0 && !activeCity) {
      setActiveCity(dataCity[0]);
    }
  }, [dataCity, activeCity]);

  // Scroll handling (giữ nguyên)
  const scrollContainer = React.useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainer.current) return;
    const { current } = scrollContainer;
    const cardWidth = 304;
    const scrollAmount = cardWidth * 2;
    current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const router = useRouter()

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
          {icon} {/* Thêm icon vào đây */}
          <span>{title}</span>
        </h2>

        {/* City Tabs */}
       {
          isDisplayNavbar && ( 
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
            {/* <<< FIX: DÙNG SKELETON TAB KHI LOADING */}
            {isLoadingDataCity ? (
              // Hiển thị 5 cái tab skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonTab key={index} />
              ))
            ) : (
              // Hiển thị data thật
              dataCity?.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setActiveCity(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCity?.title === city.title 
                      ? 'bg-sky-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {city.title}
                </button>
              ))
            )}
            {/* Hiển thị lỗi nếu có */}
            {isErrorDataCity && <p className="text-red-500">Lỗi tải danh sách thành phố.</p>}
        </div>)
       }

        {/* Carousel */}
        <div className="relative">
          {/* Nút trái (giữ nguyên) */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 backdrop-blur-sm transition"
        >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>

          {/* Cards Container */}
          <div
            ref={scrollContainer}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {/* <<< FIX: DÙNG SKELETON CARD KHI LOADING CAROUSEL */}
            {isLoadingCarousel ? (
              // Hiển thị 4 cái card skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : isErrorCarousel ? (
              // Hiển thị lỗi nếu có
              <p className="text-red-500">Lỗi tải danh sách khách sạn.</p>
            ) : (
              // Hiển thị data thật
              hotelsToShow?.map((hotel) => (
                <div
                  key={hotel.id}
                  className="flex-shrink-0 snap-center"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <AccommodationCard accommodation={hotel} />
                </div>
              ))
            )}

            {/* Báo rỗng nếu không loading, không lỗi, mà không có data */}
            {!isLoadingCarousel && !isErrorCarousel && hotelsToShow?.length === 0 && (
              <p className="text-gray-500">Không tìm thấy khách sạn nào.</p>
            )}
          </div>

          {/* Nút phải (giữ nguyên) */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 backdrop-blur-sm transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}