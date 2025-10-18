'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Wifi, Utensils, Dumbbell, Thermometer, Waves, Car, ParkingCircle, Filter, X, Star, Search, GlassWater, Headphones, Coffee } from 'lucide-react';
import Image from 'next/image';
import { useHandleHotels } from '@/service/hotels/hotelService';
import { useRouter } from 'next/navigation';
// ✅ DỌN DẸP: Xóa import 'Value' không dùng tới

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

// --- Card khách sạn (Không đổi) ---
const HotelCard = ({ hotel, onclick }) => {
    const getLabel = () => {
        if (hotel.avgRating >= 3.5) return { text: "Top Rated", color: "text-[#3DC262]" };
        return null;
    };
    const label = getLabel();

    return (
        <div
            onClick={onclick}
            className="rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 bg-white group cursor-pointer"
        >
            <div className="relative w-full h-[250px]">
                <Image
                    src="/room1.png"
                    alt={hotel.name}
                    width={50}
                    height={50}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {label && (
                    <span className={`absolute top-4 left-4 bg-white ${label.color} px-3 py-1 text-sm rounded-full font-bold shadow-sm`}>
                        {label.text}
                    </span>
                )}
            </div>
            <div className="p-5">
                <span className="flex items-center gap-1 text-yellow-500 text-xs bg-white shadow-md rounded-2xl px-4 py-2 font-semibold mb-2">
                    ⭐ <span className="text-black">{hotel.avgRating} ({hotel.reviewCount} reviews)</span>
                </span>
                <h3 className="font-bold text-lg mb-1 truncate">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-4">
                    <MapPin size={14} />
                    <span>{hotel.city.title}</span>
                </div>
                <div className="flex justify-between items-center">
                     <p className="font-semibold">
                    {Number(hotel.avgPrice ?? 0).toLocaleString('vi-VN')}
                    <span className="text-gray-700 text-sm">/đêm</span>
                  </p>
                    <button className="bg-black text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-800 transition">
                        Đặt ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Component Không có kết quả (Không đổi) ---
const NoResultsFound = ({ onReset }) => (
    <div className="text-center py-20 col-span-full">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Search size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-600 text-lg mb-2">Không tìm thấy khách sạn phù hợp</p>
        <p className="text-gray-500 mb-4">Hãy thử thay đổi hoặc xóa bộ lọc để có kết quả tốt hơn.</p>
        <button onClick={onReset} className="text-black font-semibold hover:underline">Xóa bộ lọc</button>
    </div>
);

// --- Trang chính (Đã refactor) ---
export default function HotelsPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [showFilter, setShowFilter] = useState(false);

    // --- Filter States ---
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    // ✅ TYPING: Thêm kiểu dữ liệu cho state
    const [amenities, setAmenities] = useState<string[]>([]);

    // --- Cập nhật hook call ---
    const { data: hotelsResponse } = useHandleHotels(currentPage, limit, minPrice, maxPrice, selectedStar, amenities);
    const hotelsData = hotelsResponse?.data || [];
    // ✅ DỌN DẸP: Xóa console.log
    const total = hotelsResponse?.total || 0;
    const totalPages = hotelsResponse?.totalPages || 1;

    // --- Các hàm xử lý filter ---
    const handleStarChange = (s: number) => {
        setSelectedStar(prev => (prev === s ? null : s));
    };
    const toggleAmenity = (a: string) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);


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



    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
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
                    className={`fixed inset-y-0 left-0 z-40 md:relative md:z-auto w-80 md:w-96 bg-white h-full border-r border-gray-200 transition-transform duration-300 ease-in-out transform md:translate-x-0 ${showFilter ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
                                <button onClick={() => setShowFilter(false)} className="md:hidden text-gray-500 hover:text-gray-700">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                            {/* Price filter */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Khoảng giá (VNĐ)</h3>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        className="border border-gray-300 p-2 rounded-md w-full"
                                        value={minPrice}
                                        // ✅ SỬA LOGIC: Xử lý giá trị NaN (không phải số)
                                        onChange={(e) => {
                                            const num = parseFloat(e.target.value);
                                            setMinPrice(isNaN(num) ? '' : num);
                                        }}
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        className="border border-gray-300 p-2 rounded-md w-full"
                                        value={maxPrice}
                                        // ✅ SỬA LOGIC: Xử lý giá trị NaN (không phải số)
                                        onChange={(e) => {
                                            const num = parseFloat(e.target.value);
                                            setMaxPrice(isNaN(num) ? '' : num);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* === Stars filter (Radio Buttons) - Dọc === */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Hạng sao</h3>
                                <div className="flex flex-col space-y-2" role="radiogroup">
                                    {STAR_OPTIONS.map((s) => (
                                        <label
                                            key={s}
                                            className={`flex w-full items-center justify-start gap-2 cursor-pointer border rounded-lg px-4 py-2.5 transition-colors ${selectedStar === s
                                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                : 'bg-white border-gray-300 hover:bg-gray-50'
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
                                            <div className="flex items-center text-yellow-400">
                                                {[...Array(s)].map((_, i) => (
                                                    <Star key={i} size={16} fill="#facc15" stroke="none" />
                                                ))}
                                            </div>
                                            {/* ✅ SỬA LỖI: Xóa ký tự '_' bị lạc */}
                                            <span className={`font-medium ${selectedStar === s ? 'text-blue-700' : 'text-gray-700'}`}>{s} sao</span>
                                        </label>
                                    ))}
                                </div>
                            </div>


                            {/* Amenities filter (Styled Checkboxes) */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Tiện ích phổ biến</h3>
                                <div className="flex flex-wrap gap-2">
                                    {/* ✅ SỬA LOGIC: Destructure 'name' và 'icon', bỏ 'value' không tồn tại */}
                                    {AMENITY_OPTIONS.map(({ name, icon }) => (
                                        <label
                                            key={name}
                                            className={`flex items-center gap-2 cursor-pointer border rounded-full px-4 py-2 text-sm transition-colors ${amenities.includes(name) // ✅ SỬA LOGIC: check bằng 'name'
                                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                : 'bg-white border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={amenities.includes(name)} // ✅ SỬA LOGIC: check bằng 'name'
                                                onChange={() => toggleAmenity(name)} // ✅ SỬA LOGIC: toggle bằng 'name'
                                                className="sr-only"
                                            />
                                            <span className="text-blue-600">{icon}</span>
                                            <span>{name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer Buttons */}
                        <div className="p-6 bg-white border-t border-gray-200 md:p-8">
                            <button
                                onClick={resetFilters}
                                className="w-full border border-gray-300 text-gray-700 py-2.5 px-3 rounded-lg hover:bg-gray-100 transition"
                            >
                                Xóa bộ lọc
                            </button>
                            <button
                                onClick={() => setShowFilter(false)}
                                className="w-full bg-black text-white py-2.5 px-3 rounded-lg hover:bg-gray-800 transition mt-3 md:hidden"
                            >
                                Xem kết quả
                            </button>
                        </div>
                    </div>
                </aside>


                {/* Main content */}
                <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Tất cả khách sạn</h1>
                            <p className="text-gray-600">Tìm thấy <span className="font-semibold text-gray-900">{total}</span> khách sạn.</p>
                        </div>

                        {hotelsData?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {hotelsData.map((hotel) => (
                                    <HotelCard key={hotel.id} hotel={hotel} onclick={() => router.push(`hotel-detail/${hotel.id}`)} />
                                ))}
                            </div>
                        ) : (
                            <NoResultsFound onReset={resetFilters} />
                        )}

                        {/* Pagination (Không đổi) */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-full border transition ${currentPage === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#E6F7FF] text-[#00BFFF] hover:bg-[#BFEFFF]'
                                        }`}
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-full border transition ${currentPage === page
                                            ? 'bg-[#00BFFF] text-white border-[#00BFFF]'
                                            : 'bg-[#E6F7FF] text-[#00BFFF] hover:bg-[#BFEFFF]'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-full border transition ${currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#E6F7FF] text-[#00BFFF] hover:bg-[#BFEFFF]'
                                        }`}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}   