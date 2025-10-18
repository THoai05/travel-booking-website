'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Filter, X, Star, Wifi, Utensils, Waves, Coffee, Building2, MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import { useHandleHotels } from '@/service/hotels/hotelService';
import { useRouter } from 'next/navigation';

// --- Dữ liệu filter ---
const STAR_OPTIONS = [5, 4, 3, 2, 1];
const AMENITY_OPTIONS = [
    { name: "Wifi miễn phí", icon: <Wifi size={16} /> },
    { name: "Hồ bơi", icon: <Waves size={16} /> },
    { name: "Bữa sáng", icon: <Coffee size={16} /> },
    { name: "Gần biển", icon: <Building2 size={16} /> },
    { name: "Nhà hàng", icon: <Utensils size={16} /> },
];

// --- Card khách sạn ---
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
                    <button className="bg-black text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-800 transition">
                        Đặt ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Component Không có kết quả ---
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

// --- Trang chính ---
export default function HotelsPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 8;

    const { data: hotelsResponse } = useHandleHotels(currentPage, limit);
    const hotelsData = hotelsResponse?.data || [];
    const total = hotelsResponse?.total || 0;
    const totalPages = hotelsResponse?.totalPages || 1;

    // --- Filter States ---
    const [showFilter, setShowFilter] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [stars, setStars] = useState([]);
    const [amenities, setAmenities] = useState([]);

    // --- Các hàm xử lý filter ---
    const toggleStar = (s) => setStars(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    const toggleAmenity = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

    const resetFilters = () => {
        setMinPrice(0);
        setMaxPrice(10000000);
        setStars([]);
        setAmenities([]);
    };

    const applyFilter = () => {
        const filtered = hotelsData.filter(hotel => {
            const priceMatch = hotel.price >= minPrice && hotel.price <= maxPrice;
            const starMatch = stars.length === 0 || stars.includes(Math.round(hotel.avgRating));
            const amenityMatch = amenities.length === 0 || amenities.every(a => hotel.amenities?.includes(a));
            return priceMatch && starMatch && amenityMatch;
        });
        setFilteredHotels(filtered);
        setShowFilter(false);
    };

    const [filteredHotels, setFilteredHotels] = useState(hotelsData);
    useEffect(() => {
        setFilteredHotels(hotelsData);
    }, [hotelsData]);

    const handlePageChange = (newPage) => {
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
                    className={`fixed inset-y-0 left-0 z-40 md:relative md:z-auto w-80 bg-white h-full border-r border-gray-200 transition-transform duration-300 ease-in-out transform md:translate-x-0 ${showFilter ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
                            <button onClick={() => setShowFilter(false)} className="md:hidden text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Price filter */}
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Khoảng giá (VNĐ)</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="border p-1 w-full mb-1 rounded-sm mr-2"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                />
                                <input
                                    type="number"
                                    className="border p-1 w-full mb-1 rounded-sm"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Stars filter */}
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Hạng sao</label>
                            {STAR_OPTIONS.map((s) => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer mb-2">
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

                        {/* Amenities filter */}
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Tiện ích phổ biến</label>
                            {AMENITY_OPTIONS.map(({ name, icon }) => (
                                <label key={name} className="flex items-center gap-2 cursor-pointer mb-2">
                                    <input type="checkbox" checked={amenities.includes(name)} onChange={() => toggleAmenity(name)} />
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="text-blue-300">{icon}</span>
                                        <span>{name}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={applyFilter}
                                className="bg-blue-400 text-white w-full py-2 rounded hover:bg-blue-300 flex items-center justify-center gap-2"
                            >
                                <Search size={18} /> Áp dụng bộ lọc
                            </button>
                            <button onClick={resetFilters} className="border py-2 px-3 rounded w-28">
                                Xóa
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Tất cả khách sạn</h1>
                            <p className="text-gray-600">Tìm thấy <span className="font-semibold text-gray-900">{filteredHotels?.length}</span> khách sạn.</p>
                        </div>

                        {filteredHotels?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredHotels.map((hotel) => (
                                    <HotelCard key={hotel.id} hotel={hotel} onclick={() => router.push(`hotel-detail/${hotel.id}`)} />
                                ))}
                            </div>
                        ) : (
                            <NoResultsFound onReset={resetFilters} />
                        )}

                        {/* Pagination */}
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
