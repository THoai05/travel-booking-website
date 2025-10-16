'use client';
import React, { useState, useMemo } from 'react';
import { ChevronRight, Filter, X, Star, Wifi, Utensils, Waves, Coffee, Building2, MapPin, Search } from 'lucide-react';

// Main App Component
export default function App() {
  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2500000);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Sample Data ---
  const hotelsData = [
    { id: 1, name: "Khách sạn Biển Xanh", price: 800000, stars: 4, amenities: ["Wifi miễn phí", "Hồ bơi"], location: "Nha Trang", reviews: 324, image: 'https://placehold.co/600x400/3498db/ffffff?text=Biển+Xanh' },
    { id: 2, name: "Khách sạn Ánh Dương", price: 1200000, stars: 5, amenities: ["Nhà hàng", "Bữa sáng"], location: "Đà Nẵng", reviews: 512, image: 'https://placehold.co/600x400/e74c3c/ffffff?text=Ánh+Dương' },
    { id: 3, name: "Khách sạn Phố Cổ", price: 500000, stars: 3, amenities: ["Wifi miễn phí"], location: "Hà Nội", reviews: 189, image: 'https://placehold.co/600x400/9b59b6/ffffff?text=Phố+Cổ' },
    { id: 4, name: "Khách sạn Núi Xanh", price: 700000, stars: 4, amenities: ["Hồ bơi", "Gần biển"], location: "Quy Nhơn", reviews: 267, image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Núi+Xanh' },
    { id: 5, name: "Khách sạn Thành Phố", price: 600000, stars: 3, amenities: ["Wifi miễn phí", "Nhà hàng"], location: "Hồ Chí Minh", reviews: 145, image: 'https://placehold.co/600x400/f1c40f/ffffff?text=Thành+Phố' },
    { id: 6, name: "Khách sạn Thiên Đường", price: 1500000, stars: 5, amenities: ["Hồ bơi", "Bữa sáng", "Gần biển"], location: "Phú Quốc", reviews: 678, image: 'https://placehold.co/600x400/1abc9c/ffffff?text=Thiên+Đường' },
    { id: 7, name: "Khách sạn Bình Yên", price: 400000, stars: 2, amenities: ["Wifi miễn phí"], location: "Huế", reviews: 98, image: 'https://placehold.co/600x400/34495e/ffffff?text=Bình+Yên' },
    { id: 8, name: "Khách sạn Hoàng Gia", price: 2000000, stars: 5, amenities: ["Nhà hàng", "Bữa sáng", "Hồ bơi"], location: "Sapa", reviews: 890, image: 'https://placehold.co/600x400/d35400/ffffff?text=Hoàng+Gia' },
    { id: 9, name: "Khách sạn Sông Xanh", price: 900000, stars: 4, amenities: ["Gần biển", "Wifi miễn phí"], location: "Vũng Tàu", reviews: 445, image: 'https://placehold.co/600x400/2980b9/ffffff?text=Sông+Xanh' },
    { id: 10, name: "Khách sạn Mặt Trời", price: 1100000, stars: 4, amenities: ["Hồ bơi", "Nhà hàng"], location: "Cần Thơ", reviews: 356, image: 'https://placehold.co/600x400/f39c12/ffffff?text=Mặt+Trời' },
  ];

  // --- Filter Options ---
  const STAR_OPTIONS = [1, 2, 3, 4, 5];
  const AMENITY_OPTIONS = [
    { name: "Wifi miễn phí", icon: <Wifi size={16} /> },
    { name: "Hồ bơi", icon: <Waves size={16} /> },
    { name: "Bữa sáng", icon: <Coffee size={16} /> },
    { name: "Gần biển", icon: <Building2 size={16} /> },
    { name: "Nhà hàng", icon: <Utensils size={16} /> },
  ];
  
  // --- Filter Handlers ---
  const toggleStar = (s) => {
    setSelectedStars(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(2500000);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setSearchQuery('');
  };

  // --- Memoized Filtering Logic ---
  const filteredHotels = useMemo(() => {
    return hotelsData.filter(hotel => {
      const priceMatch = hotel.price >= minPrice && hotel.price <= maxPrice;
      const starsMatch = selectedStars.length === 0 || selectedStars.includes(hotel.stars);
      const amenitiesMatch = selectedAmenities.length === 0 || selectedAmenities.every(a => hotel.amenities.includes(a));
      const searchMatch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      return priceMatch && starsMatch && amenitiesMatch && searchMatch;
    });
  }, [minPrice, maxPrice, selectedStars, selectedAmenities, searchQuery, hotelsData]);

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header & Search Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
             <h1 className="text-2xl font-bold text-gray-900 hidden md:block">HotelFinder</h1>
             <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="max-w-lg w-full lg:max-w-xs">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm khách sạn, thành phố..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-gray-900 focus:text-gray-900 sm:text-sm transition"
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

            <div className="space-y-8">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Khoảng giá (VNĐ)</h3>
                <div className="space-y-3">
                  <div className="">
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Từ" />
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(minPrice, parseInt(e.target.value) || 0))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Đến" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <span>{minPrice.toLocaleString()} ₫</span>
                    <span>{maxPrice.toLocaleString()} ₫</span>
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Hạng sao</h3>
                <div className="space-y-2">
                  {STAR_OPTIONS.map(s => (
                    <label key={s} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50">
                      <div onClick={() => toggleStar(s)} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${selectedStars.includes(s) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {selectedStars.includes(s) && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(s)].map((_, i) => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
                      </div>
                      <span className="text-gray-700 text-sm group-hover:text-gray-900 flex-1">{s} sao</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tiện ích</h3>
                <div className="space-y-2">
                  {AMENITY_OPTIONS.map(({ name, icon }) => (
                    <label key={name} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50">
                       <div onClick={() => toggleAmenity(name)} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${selectedAmenities.includes(name) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {selectedAmenities.includes(name) && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900">
                        <span className="text-gray-500">{icon}</span>
                        <span className="text-sm">{name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
               {/* Reset Button */}
              <div className="pt-4">
                 <button onClick={resetFilters} className="w-full py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
                    Xóa tất cả bộ lọc
                 </button>
              </div>
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
