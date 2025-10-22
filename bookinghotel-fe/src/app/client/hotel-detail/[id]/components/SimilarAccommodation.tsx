// components/sections/SimilarAccommodations.tsx

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccommodationCard     from './card/AccommodationCard';

interface SimilarAccommodationsProps {
  accommodations: Accommodation[];
  city: string; // Tên thành phố, ví dụ "Ngu Hanh Son District"
  totalCount: number; // Tổng số khách sạn, ví dụ 716
}

export default function SimilarAccommodations({
  accommodations,
  city,
  totalCount,
}: SimilarAccommodationsProps) {
  return (
    // Nền xanh nhạt y như hình
    <section className="p-6  rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm hover:shadow-md transition">
      
      {/* === Header: Tiêu đề + Dropdown === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Other Accommodations You Might Like</h2>
          <p className="text-gray-600">
            Similar accommodations where other guests were also staying in
          </p>
        </div>
        
        {/* Dropdown (Giả lập) */}
        <div className="text-sm mt-2 md:mt-0">
          <span className="text-gray-600">Price Display</span>
          <Button variant="ghost" className="text-blue-600 p-1">
            Per room per night (excl. taxe...
            <ChevronDown className="w-4 h-4" />
          </Button>
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
          {accommodations.map((acc) => (
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
        <Button variant="ghost" size="icon" className="rounded-full bg-white shadow">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <a href="#" className="text-blue-600 font-medium hover:underline">
          See Other Accommodations in {city} ({totalCount})
        </a>
        <Button variant="ghost" size="icon" className="rounded-full bg-white shadow">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  );
}