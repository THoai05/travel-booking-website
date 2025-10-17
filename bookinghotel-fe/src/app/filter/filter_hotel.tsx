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
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex relative max-w-full">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="fixed bottom-6 right-6 z-50 md:hidden bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-transform transform active:scale-90"
        >
          {showFilter ? <X size={24} /> : <Filter size={24} />}
        </button>

        {/* Filter Panel */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 md:relative md:z-auto w-80 bg-white h-full border-r border-gray-200 transition-transform duration-300 ease-in-out transform md:translate-x-0 ${
            showFilter ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
              <button
                onClick={() => setShowFilter(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
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
              </div>


                <button
                    onClick={applyFilter}
                    className="bg-blue-400 text-white w-full py-2 rounded hover:bg-blue-300"
                >
                    <Search className="inline-block mr-2 mb-1" size={20} />
                    Áp dụng bộ lọc
                </button>
            </div>
          </div>
        </aside>

        {/* Hotels Grid */}
        <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Kết quả tìm kiếm</h1>
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold text-gray-900">{filteredHotels.length}</span> khách sạn phù hợp.
              </p>
            </div>
            
            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
               <NoResultsFound onReset={resetFilters} />
            )}
            
            {filteredHotels.length > 0 && (
              <div className="flex justify-center mt-12">
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Xem thêm <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


// --- Child Components ---

const HotelCard = ({ hotel }) => (
  <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 bg-white hover:-translate-y-1 group">
    <div className="relative">
      <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent"></div>
      <span className="absolute top-3 left-3 bg-white text-gray-800 px-3 py-1 text-xs rounded-full font-bold shadow-md flex items-center gap-1">
        <Star size={12} className="text-yellow-400" fill="currentColor" /> {hotel.stars}.0
      </span>
      <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-red-500 hover:scale-110 transition-transform hover:bg-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
      </button>
    </div>

    <div className="p-5">
      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-black">
        {hotel.name}
      </h3>
      <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
        <MapPin size={14} />
        <span>{hotel.location}</span>
      </div>
      <div className="flex items-center gap-2 mb-4 text-xs">
        <div className="flex text-yellow-400">
          {[...Array(hotel.stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
        </div>
        <span className="text-gray-600">({hotel.reviews} đánh giá)</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 text-xl">
            {hotel.price.toLocaleString()} ₫
          </p>
          <span className="text-gray-500 text-xs">/đêm</span>
        </div>
        <button className="bg-black text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-800 transition font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          Đặt ngay
        </button>
      </div>
    </div>
  </div>
);

const NoResultsFound = ({ onReset }) => (
    <div className="text-center py-20 col-span-full">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Search size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-600 text-lg mb-2">Không tìm thấy khách sạn phù hợp</p>
        <p className="text-gray-500 mb-4">Hãy thử thay đổi hoặc xóa bộ lọc để có kết quả tốt hơn.</p>
        <button
            onClick={onReset}
            className="text-black font-semibold hover:underline"
        >
            Xóa bộ lọc
        </button>
    </div>
);
