'use client';
import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, MapPin, Wifi, Utensils, Dumbbell,
    Thermometer, Waves, Car, ParkingCircle, Filter, X, Star, Search,
    GlassWater, Headphones, Coffee, AlertTriangle // ✅ THÊM ICON LỖI
} from 'lucide-react';
import { useHandleHotels } from '@/service/hotels/hotelService';
import { useRouter } from 'next/navigation';

// --- Dữ liệu filter ---
const STAR_OPTIONS = [5, 4, 3, 2, 1];
const AMENITY_OPTIONS = [
    { name: "WiFi miễn phí", icon: <Wifi size={16} /> },
    { name: "Nhà hàng 24h", icon: <Utensils size={16} /> },
    { name: "Phòng gym", icon: <Dumbbell size={16} /> },
    { name: "Điều hòa cao cấp", icon: <Thermometer size={16} /> },
    { name: "Hồ bơi", icon: <Waves size={16} /> },
    { name: "Dịch vụ đưa đón sân bay", icon: <Car size={16} /> },
    { name: "Bãi đậu xe miễn phí", icon: <ParkingCircle size={16} /> },
    { name: "Quầy bar", icon: <GlassWater size={16} /> },
    { name: "Lễ tân 24/7", icon: <Headphones size={16} /> },
    { name: "Spa & Massage", icon: <Coffee size={16} /> },
];

// --- Card khách sạn ---
const HotelCard = ({ hotel, onclick }) => {
    const getLabel = () => {
        if (hotel.avgRating >= 3.5) return { text: "Top Rated", color: "text-[#0891b2]" };
        return null;
    };
    const label = getLabel();

    return (
        <div
            onClick={onclick}
            className="rounded-2xl overflow-hidden shadow-lg border border-cyan-100/50 hover:shadow-2xl hover:border-cyan-200 transition-all duration-300 bg-white group cursor-pointer"
        >
            <div className="relative w-full h-[250px] bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cyan-200/40 via-blue-100/30 to-cyan-100/20 flex items-center justify-center">
                    <div className="text-6xl">🏖️</div>
                </div>
                {label && (
                    <span className={`absolute top-4 left-4 bg-white/95 backdrop-blur-sm ${label.color} px-4 py-1.5 text-xs font-bold rounded-full shadow-md border border-cyan-100`}>
                        ✨ {label.text}
                    </span>
                )}
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 text-yellow-400 text-xs bg-yellow-50/80 rounded-full px-3 py-1.5 font-semibold border border-yellow-100">
                        ⭐ {hotel.avgRating}
                    </span>
                    <span className="text-xs text-gray-500">({hotel.reviewCount})</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{hotel.name}</h3>
                <div className="flex items-center gap-2 text-cyan-600 text-sm mb-5">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span className="font-medium">{hotel.city.title}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-cyan-100/50">
                    <div>
                        <p className="text-2xl font-bold text-cyan-700">
                            {Number(hotel.avgPrice ?? 0).toLocaleString('vi-VN')}
                        </p>
                        <p className="text-xs text-gray-500">/ đêm</p>
                    </div>
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                        Đặt ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ✅ COMPONENT MỚI: Skeleton Loading ---
const HotelCardSkeleton = () => (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-cyan-100/30 bg-white animate-pulse">
        <div className="relative w-full h-[250px] bg-gradient-to-br from-cyan-50 to-blue-50" />
        <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-5" />
            <div className="flex justify-between items-center pt-4 border-t border-cyan-100/50">
                <div>
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-12 bg-gray-200 rounded mt-1" />
                </div>
                <div className="h-11 w-28 bg-gray-300 rounded-full" />
            </div>
        </div>
    </div>
);

// --- Component Không có kết quả ---
const NoResultsFound = ({ onReset }) => (
    <div className="text-center py-24 col-span-full">
        <div className="w-28 h-28 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg">
            <Search size={48} className="text-cyan-500" />
        </div>
        <p className="text-gray-700 text-xl font-semibold mb-2">Không tìm thấy khách sạn phù hợp</p>
        <p className="text-gray-500 mb-6">Hãy thử thay đổi hoặc xóa bộ lọc để có kết quả tốt hơn.</p>
        <button onClick={onReset} className="text-cyan-600 font-semibold hover:text-cyan-700 transition">
            ↻ Xóa bộ lọc
        </button>
    </div>
);

// --- ✅ COMPONENT MỚI: Báo lỗi ---
const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-24 col-span-full">
        <div className="w-28 h-28 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg">
            <AlertTriangle size={48} className="text-red-500" />
        </div>
        <p className="text-gray-700 text-xl font-semibold mb-2">Ối, đã có lỗi xảy ra!</p>
        <p className="text-gray-500 mb-6">Không thể tải dữ liệu khách sạn. Vui lòng thử lại.</p>
        <button onClick={onRetry} className="bg-red-500 text-white font-semibold hover:bg-red-600 transition px-6 py-2.5 rounded-full">
            ↻ Thử lại
        </button>
    </div>
);


// --- Trang chính ---
export default function HotelsPage() {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [showFilter, setShowFilter] = useState(false);

    // --- Filter States ---
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedStar, setSelectedStar] = useState(null);
    const [amenities, setAmenities] = useState([]);

    // --- ✅ TỐI ƯU: Lấy thêm isLoading, isError, và refetch từ hook ---
    // (Giả lập hook trả về các giá trị này)
    const {
        data: hotelsResponse,
        isLoading, // Giả sử isLoading = false
        isError,   // Giả sử isError = false
        // refetch // Giả sử hook (SWR/TanStack Query) cung cấp hàm refetch
    } = useHandleHotels(currentPage, limit, minPrice, maxPrice, selectedStar, amenities);

    // Hàm refetch giả lập để component Error chạy được
    // Trong thực tế, bro sẽ dùng hàm refetch từ SWR hoặc TanStack Query
    const refetch = () => {
        console.log("Đang gọi lại API...");
        // hook.refetch(); 
    };

    const hotelsData = hotelsResponse?.data || [];
    const total = hotelsResponse?.total || 0;
    const totalPages = hotelsResponse?.totalPages || 1;

    // --- Các hàm xử lý filter ---
    const handleStarChange = (s) => {
        setSelectedStar(prev => (prev === s ? null : s));
    };
    const toggleAmenity = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedStar(null);
        setAmenities([]);
    };

    useEffect(() => {
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [minPrice, maxPrice, selectedStar, amenities]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (minPrice || maxPrice || selectedStar || amenities.length > 0) {
            setHasSearched(true);
        }
    }, [minPrice, maxPrice, selectedStar, amenities]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-cyan-50/30 to-white mt-20">
            {/* Header Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/30 to-blue-100/20 rounded-full blur-3xl -z-10" />

            <div className="flex relative max-w-full">
                {/* Mobile Filter Button */}
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="fixed bottom-6 right-6 z-50 md:hidden bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform active:scale-90"
                >
                    {showFilter ? <X size={24} /> : <Filter size={24} />}
                </button>

                {/* Filter Panel */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 md:relative md:z-auto w-80 md:w-96 bg-white/95 backdrop-blur-lg h-full border-r border-cyan-100 transition-transform duration-300 ease-in-out transform md:translate-x-0 ${showFilter ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    {/* (Nội dung filter panel giữ nguyên... ) */}
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-blue-50/80">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Bộ lọc</h2>
                                <button onClick={() => setShowFilter(false)} className="md:hidden text-gray-400 hover:text-cyan-600 transition">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                            {/* Price filter */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-800">💰 Khoảng giá (VNĐ)</h3>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        className="border border-cyan-200 bg-cyan-50/50 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                        value={minPrice}
                                        onChange={(e) => {
                                            const num = parseFloat(e.target.value);
                                            setMinPrice(isNaN(num) ? '' : num);
                                        }}
                                    />
                                    <span className="text-gray-400 font-light">-</span>
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        className="border border-cyan-200 bg-cyan-50/50 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                        value={maxPrice}
                                        onChange={(e) => {
                                            const num = parseFloat(e.target.value);
                                            setMaxPrice(isNaN(num) ? '' : num);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Stars filter */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-800">⭐ Hạng sao</h3>
                                <div className="flex flex-col space-y-2" role="radiogroup">
                                    {STAR_OPTIONS.map((s) => (
                                        <label
                                            key={s}
                                            className={`flex w-full items-center justify-start gap-3 cursor-pointer border-2 rounded-xl px-4 py-3 transition-all ${selectedStar === s
                                                ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-400 text-cyan-700'
                                                : 'bg-white border-cyan-100 hover:border-cyan-200 hover:bg-cyan-50/30'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="star-rating"
                                                value={s}
                                                checked={selectedStar === s}
                                                onChange={() => handleStarChange(s)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center text-yellow-400 gap-0.5">
                                                {[...Array(s)].map((_, i) => (
                                                    <Star key={i} size={16} fill="#facc15" stroke="none" />
                                                ))}
                                            </div>
                                            <span className="font-semibold text-gray-700">{s} sao</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities filter */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-800">✨ Tiện ích phổ biến</h3>
                                <div className="flex flex-wrap gap-2">
                                    {AMENITY_OPTIONS.map(({ name, icon }) => (
                                        <label
                                            key={name}
                                            className={`flex items-center gap-2 cursor-pointer border-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${amenities.includes(name)
                                                ? 'bg-gradient-to-r from-cyan-100 to-blue-100 border-cyan-400 text-cyan-700'
                                                : 'bg-white border-cyan-100 hover:border-cyan-200 text-gray-600 hover:bg-cyan-50/30'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={amenities.includes(name)}
                                                onChange={() => toggleAmenity(name)}
                                                className="sr-only"
                                            />
                                            <span className={amenities.includes(name) ? 'text-cyan-600' : 'text-gray-400'}>{icon}</span>
                                            <span>{name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer Buttons */}
                        <div className="p-6 bg-white border-t border-cyan-100 md:p-8 space-y-3">
                            <button
                                onClick={resetFilters}
                                className="w-full border-2 border-cyan-300 text-cyan-600 py-3 px-4 rounded-xl hover:bg-cyan-50 transition font-semibold"
                            >
                                ↻ Xóa bộ lọc
                            </button>
                            <button
                                onClick={() => setShowFilter(false)}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition mt-2 md:hidden font-semibold shadow-lg"
                            >
                                Xem kết quả
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* ✅ TỐI ƯU: Chỉ hiển thị header khi không loading hoặc không lỗi */}
                        {!isLoading && !isError && (
                            <div className="mb-10">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-cyan-700 bg-clip-text text-transparent mb-2">
                                    🌴 Tất cả khách sạn
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2">
                                    Tìm thấy <span className="font-bold text-cyan-600 text-lg">{total}</span>
                                    <span>khách sạn tuyệt vời</span>
                                </p>
                            </div>
                        )}
                        
                        {/* ✅ TỐI ƯU: Logic render theo 4 trạng thái */}
                        {isLoading ? (
                            // 1. Trạng thái Loading
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(limit)].map((_, i) => (
                                    <HotelCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : isError ? (
                            // 2. Trạng thái Error
                            <ErrorMessage onRetry={refetch} />
                        ) : hotelsData?.length > 0 ? (
                            // 3. Trạng thái có dữ liệu
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {hotelsData.map((hotel) => (
                                    <HotelCard
                                        key={hotel.id}
                                        hotel={hotel}
                                        onclick={() => router.push(`hotel-detail/${hotel.id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            // 4. Trạng thái không có dữ liệu (đã load xong, không lỗi)
                            <NoResultsFound onReset={resetFilters} />
                        )}


                        {/* Pagination */}
                        {/* ✅ TỐI ƯU: Chỉ hiển thị pagination khi không loading, không lỗi và có data */}
                        {!isLoading && !isError && totalPages > 1 && (
                            <div className="flex justify-center mt-16 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-full border-2 transition ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-full border-2 font-semibold transition ${currentPage === page
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-500'
                                            : 'bg-white text-cyan-600 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50/50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-full border-2 transition ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50'
                                        }`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}