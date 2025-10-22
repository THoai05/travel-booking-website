'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, ChevronRight, MapPin, Wifi, Utensils, Dumbbell,
    Thermometer, Waves, Car, ParkingCircle, Filter, X, Star, Search,
    GlassWater, Headphones, Coffee, AlertTriangle,
    Menu,
    Heart, Clock, Users // ✅ THÊM ICON CHO CARD MỚI
} from 'lucide-react';
import { useHandleHotels } from '@/service/hotels/hotelService';
import { useRouter } from 'next/navigation';
import { useHandleFilterTitleCity } from '@/service/city/cityService';

// Interface City
interface City {
    id: string;
    title: string;
    image: string;
    hotels?: any[];
}

// --- Dữ liệu filter (Giữ nguyên) ---
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

// ✅ --- COMPONENT HOTELCARD MỚI (THEO STYLE RECOMMENDEDTOURS) ---
// ✅ --- COMPONENT HOTELCARD MỚI (ĐÃ SỬA LAYOUT FLEXBOX) ---
const HotelCard = ({ hotel, onclick }) => {
    // Logic label từ card cũ
    const getLabel = () => {
        if (hotel.avgRating >= 3.5) return { text: "Top Rated", color: "text-[#3DC262]" };
        return null;
    };
    const label = getLabel();

    return (
        <div
            key={hotel.id}
            onClick={onclick}
            className="rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer hover:-translate-y-1 flex flex-col" // ✅ Added flex flex-col here too
        >
            {/* Ảnh */}
            <div className="relative w-full h-[250px] rounded-t-3xl overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 flex-shrink-0"> {/* ✅ Added flex-shrink-0 */}
                <div className="w-full h-full bg-gradient-to-br from-cyan-200/40 via-blue-100/30 to-cyan-100/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="text-6xl">🏖️</div>
                </div>
                {label && (
                    <span className={`absolute top-4 left-4 bg-white ${label.color} px-3 py-1 text-sm rounded-full font-bold shadow-md`}>
                        {label.text}
                    </span>
                )}
                <div className="absolute top-4 right-4 h-9 w-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Heart size={18} className="text-red-500" />
                </div>
            </div>

            {/* Thông tin */}
            {/* ✅ THAY ĐỔI 1: Thêm flex flex-col và min-height */}
            <div className="relative z-10 p-5 -mt-6 bg-white rounded-t-3xl flex flex-col flex-grow min-h-[210px]"> {/* Adjust min-h if needed */}

                {/* Phần content phía trên (Rating, Name, City, Amenities) */}
                <div className="flex-grow"> {/* ✅ Wrap content above footer */}
                    {/* Rating */}
                    <span className="absolute -top-4 right-5 flex items-center gap-1 text-yellow-500 text-xs bg-white shadow-md rounded-2xl px-4 py-2 border border-gray-100">
                        <Star size={14} fill="#facc15" className="text-yellow-400" />
                        <span className="text-black font-medium">
                            {hotel.avgRating}
                            <span className="text-gray-500 font-normal"> ({hotel.reviewCount} đánh giá)</span>
                        </span>
                    </span>

                    {/* Tên khách sạn */}
                    <div className="flex items-center justify-between mb-2 mt-4">
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-cyan-600 transition">
                            {hotel.name}
                        </h3>
                    </div>

                    {/* City Title */}
                    <p className="text-gray-600 text-sm flex items-center gap-2 mb-3"> {/* Added mb-3 */}
                        <MapPin size={14} className="text-cyan-500 flex-shrink-0" />
                        <span className="line-clamp-1">{hotel.city.title}</span>
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm pt-3 border-t border-gray-100 min-h-[50px]"> {/* Added min-h */}
                        {hotel?.amenities && typeof hotel.amenities === 'string' && hotel.amenities.length > 0 ? (
                            hotel.amenities.split(',').slice(0, 4).map((amenity) => (
                                <div key={amenity} className="flex items-center gap-1.5 text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full">
                                    <Wifi size={14} className="flex-shrink-0" />
                                    <span>{amenity}</span>
                                </div>
                            ))
                        ) : (
                            // Optional: Placeholder or leave empty if no amenities
                            <span className="text-xs text-gray-400 italic">Không có thông tin tiện ích</span>
                        )}
                    </div>
                </div> {/* End Wrapper */}


                {/* ✅ THAY ĐỔI 2: Phần Giá và Nút - Thêm mt-auto, pt-4, border-t */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    {/* Giá */}
                    <p className="font-bold text-xl text-cyan-700">
                        {Number(hotel.avgPrice ?? 0).toLocaleString('vi-VN')}
                        <span className="text-gray-700 text-sm font-normal"> / đêm</span>
                    </p>
                    {/* Nút */}
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm px-5 py-2.5 rounded-full hover:from-cyan-600 hover:to-blue-600 font-semibold shadow-md hover:shadow-lg transition-all active:scale-95">
                        Đặt ngay
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Skeleton (Giữ nguyên) ---
const HotelCardSkeleton = () => (
    <div className="rounded-3xl overflow-hidden shadow-lg border border-cyan-100/30 bg-white animate-pulse">
        <div className="relative w-full h-[250px] bg-gradient-to-br from-cyan-50 to-blue-50" />
        <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-5" />
            <div className="flex justify-between items-center pt-4 border-cyan-100/50">
                <div>
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-12 bg-gray-200 rounded mt-1" />
                </div>
                <div className="h-11 w-28 bg-gray-300 rounded-full" />
            </div>
        </div>
    </div>
);

// --- NoResultsFound (Giữ nguyên) ---
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

// --- ErrorMessage (Giữ nguyên) ---
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


// --- Trang chính (Giữ nguyên) ---
export default function HotelsPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [showFilter, setShowFilter] = useState(false);

    // --- Filter States ---
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedStar, setSelectedStar] = useState(null);
    const [amenities, setAmenities] = useState([]);
    const [citySearchQuery, setCitySearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [isCitySuggestionsOpen, setIsCitySuggestionsOpen] = useState(false);
    const [hotelNameQuery, setHotelNameQuery] = useState('');
    const citySearchRef = useRef<HTMLDivElement>(null);

    // --- STATE MỚI CHO PAGE INPUT ---
    const [pageInput, setPageInput] = useState(currentPage.toString());

    // --- Hooks ---
    const { data: citiesData, isLoading: isLoadingCities } = useHandleFilterTitleCity(citySearchQuery);
    const {
        data: hotelsResponse,
        isLoading,
        isError,
        // refetch 
    } = useHandleHotels(
        currentPage,
        limit,
        minPrice,
        maxPrice,
        selectedStar,
        amenities,
        selectedCity?.title,
        hotelNameQuery
    );

    // --- Data ---
    const hotelsData = hotelsResponse?.data || [];
    const total = hotelsResponse?.total || 0;
    const totalPages = hotelsResponse?.totalPages || 1;

    // --- Biến kiểm tra lọc ---
    const isFiltered = Boolean(
        minPrice ||
        maxPrice ||
        selectedStar ||
        amenities.length > 0 ||
        selectedCity ||
        hotelNameQuery
    );

    // --- Hàm xử lý ---
    const refetch = () => {
        console.log("Đang gọi lại API...");
        // hook.refetch(); 
    };

    const handleStarChange = (s) => {
        setSelectedStar(prev => (prev === s ? null : s));
    };
    const toggleAmenity = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

    const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setCitySearchQuery(query);
        setSelectedCity(null);
        setIsCitySuggestionsOpen(query.length > 0);
    };

    const handleCitySelect = (city: City) => {
        setSelectedCity(city);
        setCitySearchQuery('');
        setIsCitySuggestionsOpen(false);
    };

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedStar(null);
        setAmenities([]);
        setCitySearchQuery('');
        setSelectedCity(null);
        setHotelNameQuery('');
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- HÀM XỬ LÝ PAGE INPUT ---
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageInput(e.target.value);
    };

    const handlePageInputSubmit = () => {
        let newPage = parseInt(pageInput, 10);

        if (isNaN(newPage) || newPage < 1) {
            newPage = 1;
        } else if (newPage > totalPages) {
            newPage = totalPages;
        }

        handlePageChange(newPage);
    };


    // --- UseEffects ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                citySearchRef.current &&
                !citySearchRef.current.contains(event.target as Node)
            ) {
                setIsCitySuggestionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [minPrice, maxPrice, selectedStar, amenities, selectedCity, hotelNameQuery]);

    // --- EFFECT ĐỂ SYNC INPUT VÀ CURRENT PAGE ---
    useEffect(() => {
        setPageInput(currentPage.toString());
    }, [currentPage]);


    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-cyan-50/30 to-white mt-20">
            {/* Header Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/30 to-blue-100/20 rounded-full blur-3xl -z-10" />

            <div className="flex relative max-w-full">

                {/* Mobile Filter Button (FAB) */}
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="fixed bottom-6 right-6 z-50 md:hidden bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform active:scale-90"
                >
                    {showFilter ? <X size={24} /> : <Filter size={24} />}
                </button>

                {/* Filter Panel */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-40 w-80 bg-white/95 backdrop-blur-lg h-full border-r border-cyan-100
                        transition-all duration-300 ease-in-out transform 
                        ${showFilter ? "translate-x-0" : "-translate-x-full"} 

                        md:relative md:inset-y-auto md:z-auto md:h-auto md:transform-none 
                        md:transition-[width,margin] md:duration-300 
                        ${showFilter ? 'md:w-96' : 'md:w-0'}
                        overflow-hidden
                    `}
                >
                    {/* Div con để giữ width cố định */}
                    <div className="flex flex-col h-full w-80 md:w-96">
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-blue-50/80">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Bộ lọc</h2>
                                <button onClick={() => setShowFilter(false)} className="text-gray-400 hover:text-cyan-600 transition">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content Area (Giữ nguyên) */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                            {/* (Nội dung filter... giữ nguyên) */}
                            {/* 1. City Search */}
                            <div className="relative space-y-4" ref={citySearchRef}>
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <MapPin size={16} className="text-cyan-500" />
                                    Tìm theo Thành Phố
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nhập tên thành phố..."
                                        value={selectedCity ? selectedCity.title : citySearchQuery}
                                        onChange={handleCityInputChange}
                                        onFocus={() => citySearchQuery && setIsCitySuggestionsOpen(true)}
                                        className="border border-cyan-200 bg-cyan-50/50 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-10"
                                    />
                                    {(citySearchQuery || selectedCity) && (
                                        <button
                                            onClick={() => {
                                                setCitySearchQuery('');
                                                setSelectedCity(null);
                                                setIsCitySuggestionsOpen(false);
                                            }}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                                            aria-label="Xóa thành phố"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                                {isCitySuggestionsOpen && (
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-cyan-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-2 backdrop-blur-xl">
                                        {isLoadingCities ? (
                                            <p className="p-3 text-gray-400">Đang tải...</p>
                                        ) : citiesData?.length > 0 ? (
                                            citiesData.map((city) => (
                                                <button
                                                    key={city.id}
                                                    onClick={() => handleCitySelect(city)}
                                                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-cyan-50 text-left transition-colors group"
                                                >
                                                    <img
                                                        src={city.image}
                                                        alt={city.title}
                                                        className="w-10 h-10 object-cover rounded-md flex-shrink-0 group-hover:scale-110 transition-transform"
                                                    />
                                                    <span className="text-gray-800 group-hover:text-cyan-600 transition-colors">{city.title}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="p-3 text-gray-400">Không tìm thấy thành phố.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 2. Hotel Name Search */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Search size={16} className="text-cyan-500" />
                                    Tìm theo Tên Khách Sạn
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nhập tên khách sạn..."
                                        value={hotelNameQuery}
                                        onChange={(e) => setHotelNameQuery(e.target.value)}
                                        className="border border-cyan-200 bg-cyan-50/50 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-10"
                                    />
                                    {hotelNameQuery && (
                                        <button
                                            onClick={() => setHotelNameQuery('')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                                            aria-label="Xóa tên khách sạn"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

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

                        {/* Sticky Footer Buttons (Giữ nguyên) */}
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
                <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8 transition-all duration-300 ease-in-out">
                    <div className="max-w-7xl mx-auto">

                        {/* Header (Giữ nguyên) */}
                        {!isLoading && !isError && (
                            <div className="mb-10">

                                {!showFilter && (
                                    <button
                                        onClick={() => setShowFilter(true)}
                                        className="hidden md:inline-flex items-center gap-2 mb-6 text-cyan-600 hover:text-cyan-700 font-semibold transition bg-cyan-50/50 hover:bg-cyan-100/50 border border-cyan-200 px-4 py-2 rounded-lg shadow-sm"
                                    >
                                        <Menu size={18} />
                                        <span>Hiển thị bộ lọc</span>
                                    </button>
                                )}

                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-cyan-700 bg-clip-text text-transparent mb-2">
                                    🌴 Tất cả khách sạn
                                </h1>

                                {isFiltered && (
                                    <p className="text-gray-600 flex flex-wrap items-center gap-x-2">
                                        Tìm thấy <span className="font-bold text-cyan-600 text-lg">{total}</span>
                                        <span>khách sạn phù hợp.</span>
                                        {selectedCity && (
                                            <span className="text-gray-500">
                                                (Tại <span className="font-semibold text-cyan-600">{selectedCity.title}</span>)
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Logic render 4 trạng thái */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(limit)].map((_, i) => (
                                    <HotelCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : isError ? (
                            <ErrorMessage onRetry={refetch} />
                        ) : hotelsData?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {hotelsData.map((hotel) => (
                                    <HotelCard
                                        key={hotel.id}
                                        hotel={hotel}
                                        onclick={() => router.push(`hotel-detail/${hotel.id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoResultsFound onReset={resetFilters} />
                        )}


                        {/* PAGINATION VỚI INPUT (Giữ nguyên) */}
                        {!isLoading && !isError && totalPages > 1 && (
                            <div className="flex justify-center items-center mt-16 space-x-3">

                                {/* Nút Quay Lại */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-full border-2 transition ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50 active:scale-95'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {/* Hiển thị trang (có input) */}
                                <div className="flex items-center justify-center px-4 py-2 rounded-full border-2 border-cyan-100 bg-white shadow-sm">
                                    <span className="text-sm font-semibold text-cyan-700 whitespace-nowrap mr-2">
                                        Trang
                                    </span>
                                    <input
                                        type="number"
                                        value={pageInput}
                                        onChange={handlePageInputChange}
                                        onBlur={handlePageInputSubmit} // Validate khi click ra ngoài
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handlePageInputSubmit();
                                                (e.target as HTMLInputElement).blur(); // Tắt focus
                                            }
                                        }}
                                        className="w-12 text-center font-semibold text-cyan-700 bg-cyan-50/50 border border-cyan-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        min="1"
                                        max={totalPages}
                                    />
                                    <span className="text-sm font-semibold text-cyan-700 whitespace-nowrap ml-2">
                                        / {totalPages}
                                    </span>
                                </div>

                                {/* Nút Tới */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-full border-2 transition ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50 active:scale-95'
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