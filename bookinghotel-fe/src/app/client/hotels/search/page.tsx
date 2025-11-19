'use client';

import React, { useState, useEffect } from 'react';
import FacilitiesFilter from './components/FacilitiesFilter';
import FilterSection from './components/FilterSection';
import HotelSearchBar from './components/HotelSearchBar';
import { HotelSection } from './components/HotelSection';
import PriceRange from './components/PriceRange';
import StarFilter from './components/StarFilter';
import { useHandleHotels } from '@/service/hotels/hotelService';
import { useInView } from 'react-intersection-observer'; // <-- 1. Import hook
import { useSearchParams } from 'next/navigation';

const MIN_PRICE = 100000;
const MAX_PRICE = 10000000;

export default function SearchResultPage() {
  
   const searchParams = useSearchParams();

  // Lấy cityTitle từ query string
  const cityTitleParam = searchParams.get('cityTitle') || '';
  // ===== 1. XÓA STATE `page` =====
  // const [page, setPage] = useState(1); // <-- XÓA


  const [limit, setLimit] = useState(10); 
  
  // (Giữ nguyên tất cả state filter: cityTitle, hotelName, priceRange...)
  const [cityTitle, setCityTitle] = useState(cityTitleParam);
  const [hotelName, setHotelName] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([MIN_PRICE, MAX_PRICE]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedStar, setSelectedStar] = useState<string | null>(null);

  // (Giữ nguyên logic chuẩn bị params: minPrice, maxPrice, starParam...)
  const minPrice = priceRange[0];
  const maxPrice = priceRange[1];
  const starParam = selectedStar ? Number(selectedStar) : undefined;
  const amenitiesParam = selectedFacilities.length > 0 ? selectedFacilities : undefined;
 

  // ===== 2. GỌI HOOK MỚI =====
  const { 
    data, 
    isLoading,         // Dùng cho lần tải đầu tiên (hiện Skeleton)
    error,
    fetchNextPage,     // Hàm để gọi trang tiếp theo
    hasNextPage,       // (boolean) Báo xem còn trang để tải không
    isFetchingNextPage // (boolean) Báo đang tải trang tiếp (hiện spinner cuối trang)
  } = useHandleHotels( // <-- KHÔNG CẦN truyền `page`
    limit,
    minPrice,
    maxPrice,
    starParam,
    amenitiesParam,
    cityTitle,
    hotelName
  );

  // ===== 3. SETUP TRIGGER CUỘN =====
  const { ref, inView } = useInView({
    threshold: 0, // Kích hoạt ngay khi 1 pixel của nó chạm
  });

  // Effect này sẽ chạy khi 'inView' (đã cuộn tới đáy) thay đổi
  useEffect(() => {
    // Nếu: 1. Đã cuộn tới đáy (inView)
    //      2. Vẫn còn trang tiếp (hasNextPage)
    //      3. Không đang tải (cả lần đầu và lần tiếp)
    if (inView && hasNextPage && !isLoading && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);


  // (Hàm handleSearch giữ nguyên)
  const handleSearch = ( city: string) => {
    // setPage(1); // <-- XÓA
    setCityTitle(city);
  
  };
  
  // (Các hàm filter KHÔNG CẦN reset page nữa, React Query tự lo)
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  }
  const handleFacilityChange = (value: string[]) => {
    setSelectedFacilities(value);
  }
  const handleStarChange = (value: string) => { // Giả sử StarFilter trả về string
    setSelectedStar(value);
  }



  // ===== 4. GỘP DỮ LIỆU =====
  // 'data.pages' là một mảng của các 'HotelApiResponse'
  // [{ page: 1, data: [...] }, { page: 2, data: [...] }]
  // Chúng ta gộp (flatMap) 'data' của mỗi trang lại
  const allHotels = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className='min-h-screen mt-15 bg-white'>
      <HotelSearchBar onSearch={handleSearch} />
      
      <main className="w-full max-w-7xl px-4 pb-6 pt-10 mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* (Phần Aside - Filter KHÔNG THAY ĐỔI) */}
          <aside className="w-full md:w-1/4 lg:w-1/6">
            <div className="space-y-4">
              <FilterSection title="Mức giá" defaultOpen={true} showReset={true}>
                <PriceRange 
                  value={priceRange}
                  onChange={handlePriceChange}
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                />
              </FilterSection>
              <FilterSection title="Tiện ích" defaultOpen={true} showSeeAll={true} showReset={true}>
                <FacilitiesFilter
                  selected={selectedFacilities}
                  onChange={handleFacilityChange}
                />
              </FilterSection>
              <FilterSection title="Xếp hạng sao" defaultOpen={true}>
                <StarFilter
                  value={selectedStar}
                  onChange={handleStarChange}
                />
              </FilterSection>
            </div>
          </aside>

          {/* ===== CỘT PHẢI (DANH SÁCH HOTEL) ===== */}
          <div className="w-full md:w-2/3 lg:w-5/6">
            {/* ===== 5. TRUYỀN DỮ LIỆU ĐÃ GỘP XUỐNG ===== */}
            <HotelSection
              hotels={allHotels} // <-- Truyền mảng đã gộp
              isLoading={isLoading} // <-- Chỉ truyền isLoading (cho skeleton)
              
              // XÓA CÁC PROPS PAGINATION CŨ
              // totalPages={...}
              // currentPage={...}
              // onPageChange={...}
            />

            {/* ===== 6. "CẢM BIẾN" VÀ SPINNER TẢI THÊM ===== */}
            <div ref={ref} className="h-20 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="text-sky-600 font-semibold">
                  Đang tải thêm...
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
