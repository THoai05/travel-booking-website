'use client'
import React from 'react';
import { HotelCard, Hotel } from './HotelCard';
import { Skeleton } from './ui/skeleton';

interface HotelSectionProps {
  hotels?: Hotel[];
  onSelectRoom?: (hotelId: string) => void;
}

// Mock data for demonstration




export const HotelCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* === Cột Ảnh Skeleton === */}
        <div className="relative w-full sm:w-80 flex-shrink-0">
          {/* Ảnh chính */}
          <Skeleton className="w-full h-48" />
          
          {/* 3 Thumbnails */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        {/* === Cột Nội Dung Skeleton === */}
        <div className="flex-1 p-4 flex flex-col sm:flex-row justify-between gap-4">
          
          {/* Khối thông tin (trái) */}
          <div className="flex-1 space-y-3">
            {/* Header (Tên & Rating) */}
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-6 w-3/4" /> {/* Tên KS */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <Skeleton className="h-4 w-24" /> {/* Rating (9.1) + Review */}
                <Skeleton className="h-3 w-16" /> {/* Rating Label */}
              </div>
            </div>

            {/* Category, Stars & Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-6 w-20" /> {/* Category Badge */}
              <Skeleton className="h-4 w-16" /> {/* Dãy 4 sao */}
              <Skeleton className="h-6 w-32" /> {/* Badge đặc biệt */}
            </div>

            {/* Location */}
            <Skeleton className="h-4 w-full" />

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>

          {/* Khối Giá & Nút (phải) */}
          <div className="flex flex-col justify-between gap-4 pt-3 border-t sm:pt-0 sm:border-t-0 sm:border-l sm:pl-4 sm:w-56 flex-shrink-0">
            {/* Giá */}
            <div className="flex flex-col items-end space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Giá gốc */}
              <Skeleton className="h-7 w-28" /> {/* Giá hiện tại */}
              <Skeleton className="h-3 w-32" /> {/* Số phòng còn lại */}
            </div>
            
            {/* Nút */}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HotelSection: React.FC<HotelSectionProps> = ({ 
  hotels, 
  isLoading,
  onSelectRoom,
  totalPages,
  currentPage,
  onPageChange
}) => {

  const handleSelectRoom = (hotelId: string) => {
    console.log('Selected room for hotel:', hotelId);
    onSelectRoom?.(hotelId);
  };

  // 2. XỬ LÝ LOADING (Đây là phần thay đổi)
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Render 3 cái Skeleton (hoặc bao nhiêu bro muốn) */}
        {[...Array(3)].map((_, index) => (
          <HotelCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // 3. Xử lý không có kết quả (Giữ nguyên)
  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">Không tìm thấy khách sạn</h3>
        <p className="text-gray-600">Vui lòng thử thay đổi bộ lọc của bạn.</p>
      </div>
    );
  }

  // 4. Render data thật (Giữ nguyên)
  return (
    <div className="space-y-4">
      {hotels.map((hotel) => (
        <HotelCard 
          key={hotel.id} 
          hotel={hotel} 
          onSelectRoom={handleSelectRoom}
        />
      ))}
      
      {/* TODO: Component Pagination của bro ở đây */}
      {/* <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      /> 
      */}
    </div>
  );
};
