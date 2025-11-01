// components/sections/SimilarAccommodations.tsx

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccommodationCard     from './card/AccommodationCard';

export interface Accommodations {
    id: number,
    name: string,
    address: string,
    avgPrice: number,
    phone: string,
    city: {
       id: number,
       title: string
        },
    avgRating: number,
    reviewCount: number
}

interface SimilarAccommodationsProps{
  city:string
  data:Accommodations[]
  
}
export default function SimilarAccommodations({
  city,
  data
}: SimilarAccommodationsProps) {
  return (
    // Nền xanh nhạt y như hình
    <section className="p-6  rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm hover:shadow-md transition">
      
      {/* === Header: Tiêu đề + Dropdown === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Có thể bạn muốn biết</h2>
          <p className="text-gray-600">
           Những khách sạn mà các khách hàng khác đã trải nghiệm
          </p>
        </div>
        
      </div>

      {/* === List Khách sạn Scroll Ngang === */}
      <div className="flex items-center">
        {/* Nút lùi (Tạm thời disable) */}
        <Button variant="outline" size="icon" className="rounded-full mr-2 hidden md:flex">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        {/* Container scroll */}
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {data?.map((acc) => (
            <AccommodationCard key={acc.id} accommodation={acc} />
          ))}
        </div>
        
        {/* Nút tiến (Tạm thời disable) */}
        <Button variant="outline" size="icon" className="rounded-full ml-2 hidden md:flex">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* === Link "See Other" ở cuối === */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <a href="#" className="text-sky-600 font-medium hover:underline">
          Tìm hiểu thêm về  {city}
        </a>
      </div>
    </section>
  );
}