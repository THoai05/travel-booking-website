'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  MapPin,
  Users,
  Bed,
  Waves,
  Star,
  ChevronDown,
  X,
  Zap,
} from 'lucide-react';
import { useHandleFilterTitleCity } from '@/service/city/cityService';
import { useHandleHotelById } from '@/service/hotels/hotelService';

// Interfaces
interface Room {
  id: number;
  hotelId: string;
  name: string;
  image: string;
  price: number;
  location: string;
  guests: number;
  beds: number;
  rating: number;
  reviews: number;
  roomType: string;
  view: string;
}

interface City {
  id: string;
  title: string;
  image: string;
  hotels?: Hotel[];
}

interface Hotel {
  id: string;
  name: string;
  image?: string;
  description?: string;
  address?: string;
  rooms?: Room[];
}

// Mock Amenities Data - ONLY AMENITIES
const AMENITIES_MOCK: { [key: string]: string[] } = {
  default: ['WiFi miễn phí', 'Điều hòa', 'TV', 'Tủ lạnh', 'Bồn tắm', 'Ban công'],
  premium: ['WiFi miễn phí', 'Bữa sáng', 'Hồ bơi', 'Gym', 'Bar trên mái', 'Dịch vụ phòng'],
  deluxe: ['WiFi miễn phí', 'Hồ bơi', 'Bãi biển riêng', 'Spa', 'Nhà hàng', 'Phòng gym'],
  standard: ['WiFi miễn phí', 'Bữa sáng', 'Phòng gym', 'Bar', 'Hiệp hội kinh doanh', 'Lễ tân 24/7'],
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const getAmenitiesForRoom = (roomType: string): string[] => {
  return AMENITIES_MOCK[roomType] || AMENITIES_MOCK.default;
};

export default function HotelRoomsPage() {
  // State lọc phòng
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // State cho City Search & Select
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const { data: citiesData, isError, isLoading: isLoadingCities } = useHandleFilterTitleCity(citySearchQuery);

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isCitySuggestionsOpen, setIsCitySuggestionsOpen] = useState(false);

  // State cho Hotel Select
  const [isHotelDropdownOpen, setIsHotelDropdownOpen] = useState(false);
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const { data: dataHotel, isLoading: isLoadingHotel } = useHandleHotelById(selectedHotel?.id);

  // Ref để xử lý click outside
  const citySearchRef = useRef<HTMLDivElement>(null);
  const hotelDropdownRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách khách sạn từ selectedCity
  const hotelsInSelectedCity = useMemo(() => {
    return selectedCity?.hotels || [];
  }, [selectedCity]);

  // Lọc khách sạn dựa trên thanh search hotel
  const filteredHotelsInCity = useMemo(() => {
    if (!hotelSearchQuery) {
      return hotelsInSelectedCity;
    }
    return hotelsInSelectedCity.filter((hotel) =>
      hotel.name.toLowerCase().includes(hotelSearchQuery.toLowerCase())
    );
  }, [hotelsInSelectedCity, hotelSearchQuery]);

  // Effect tự động chọn hotel đầu tiên khi city thay đổi
  useEffect(() => {
    if (filteredHotelsInCity.length > 0 && (!selectedHotel || !filteredHotelsInCity.find(h => h.id === selectedHotel.id))) {
      setSelectedHotel(filteredHotelsInCity[0]);
    } else if (filteredHotelsInCity.length === 0) {
      setSelectedHotel(null);
    }
  }, [filteredHotelsInCity]);

  // Effect xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        citySearchRef.current &&
        !citySearchRef.current.contains(event.target as Node)
      ) {
        setIsCitySuggestionsOpen(false);
      }
      if (
        hotelDropdownRef.current &&
        !hotelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHotelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Hàm xử lý
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCitySearchQuery(query);
    setSelectedCity(null);
    setSelectedHotel(null);
    setIsCitySuggestionsOpen(query.length > 0);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCitySearchQuery('');
    setIsCitySuggestionsOpen(false);
    setHotelSearchQuery('');
    setSelectedHotel(null);
    setSelectedType('all');
  };

  const handleHotelToggle = () => {
    setIsHotelDropdownOpen(!isHotelDropdownOpen);
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setHotelSearchQuery('');
    setIsHotelDropdownOpen(false);
  };

  // Logic lọc phòng cuối cùng
  const filteredRooms = useMemo(() => {
    if (!selectedHotel || !dataHotel?.rooms) return [];

    return dataHotel?.rooms.filter((room) => {
      const matchesSearch =
        room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || room.roomType === selectedType;
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'low' && room.price < 1500000) ||
        (priceRange === 'medium' && room.price >= 1500000 && room.price < 2500000) ||
        (priceRange === 'high' && room.price >= 2500000);
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [selectedHotel, dataHotel?.rooms, searchQuery, selectedType, priceRange]);

  const roomTypeMap = new Map<string, string>([
    ['deluxe', 'Deluxe'],
    ['single', 'Single'],
    ['double', 'Double'],
  ]);

  const roomBedMap = new Map<string, string>([
    ['deluxe', 2],
    ['single', 1],
    ['double', 2],
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 mt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-emerald-300 rounded-full"></div>
            <h1 className="text-5xl font-bold text-gray-800">Tìm kiếm phòng</h1>
          </div>
          <p className="text-gray-500 text-lg">Khám phá những lựa chọn phòng tuyệt vời cho kỳ nghỉ của bạn</p>
        </div>

        {/* FILTER SECTION */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-cyan-100/50 shadow-lg">
            {/* City Search */}
            <div className="relative" ref={citySearchRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="w-4 h-4 inline mr-2 text-cyan-500" />
                Điểm Đến
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm thành phố bạn muốn đến"
                  value={selectedCity ? selectedCity.title : citySearchQuery}
                  onChange={handleCityInputChange}
                  onFocus={() => citySearchQuery && setIsCitySuggestionsOpen(true)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-400 focus:outline-none bg-white text-gray-800 placeholder-gray-400 transition-all pr-10"
                />
                {(citySearchQuery || selectedCity) && (
                  <button
                    onClick={() => {
                      setCitySearchQuery('');
                      setSelectedCity(null);
                      setSelectedHotel(null);
                      setIsCitySuggestionsOpen(false);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                    aria-label="Xóa thành phố"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Suggestions Panel */}
              {isCitySuggestionsOpen && citiesData?.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-cyan-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-2 backdrop-blur-xl">
                  {isLoadingCities ? (
                    <p className="p-3 text-gray-400">Đang tải...</p>
                  ) : (
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
                  )}
                </div>
              )}
            </div>

            {/* Hotel Select */}
            <div className="relative" ref={hotelDropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Waves className="w-4 h-4 inline mr-2 text-cyan-500" />
                Chọn Khách Sạn
              </label>
              <button
                onClick={handleHotelToggle}
                disabled={!selectedCity || hotelsInSelectedCity.length === 0}
                className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-400 focus:outline-none bg-white transition-all flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 hover:border-cyan-300"
              >
                {selectedHotel ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedHotel.image || selectedCity?.image}
                      alt={selectedHotel.name}
                      className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                    />
                    <span className="font-semibold text-gray-800 truncate">
                      {selectedHotel.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">
                    {!selectedCity
                      ? 'Vui lòng chọn thành phố'
                      : hotelsInSelectedCity.length === 0
                      ? 'Thành phố này chưa có khách sạn'
                      : 'Chọn khách sạn'}
                  </span>
                )}
                <ChevronDown
                  className={`w-5 h-5 text-cyan-500 transition-transform flex-shrink-0 ${
                    isHotelDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              {isHotelDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-cyan-200 rounded-xl shadow-2xl backdrop-blur-xl">
                  <input
                    type="text"
                    placeholder="Tìm khách sạn..."
                    value={hotelSearchQuery}
                    onChange={(e) => setHotelSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border-b border-cyan-200 focus:outline-none bg-white text-gray-800 placeholder-gray-400 rounded-t-xl"
                  />
                  <div className="max-h-60 overflow-y-auto p-2">
                    {filteredHotelsInCity.length > 0 ? (
                      filteredHotelsInCity.map((hotel) => (
                        <button
                          key={hotel.id}
                          onClick={() => handleHotelSelect(hotel)}
                          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-cyan-50 text-left transition-colors group"
                        >
                          <img
                            src={hotel.image || selectedCity?.image}
                            alt={hotel.name}
                            className="w-10 h-10 object-cover rounded-md flex-shrink-0 group-hover:scale-110 transition-transform"
                          />
                          <span className="text-gray-800 group-hover:text-cyan-600 transition-colors truncate">
                            {hotel.name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="p-3 text-gray-400">
                        {hotelsInSelectedCity.length === 0 ? 'Chưa có khách sạn.' : 'Không tìm thấy khách sạn.'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Bed className="w-4 h-4 inline mr-2 text-cyan-500" />
                Loại phòng
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-400 focus:outline-none bg-white text-gray-800 transition-all hover:border-cyan-300"
              >
                <option value="all">Tất cả</option>
                {dataHotel?.rooms && dataHotel.rooms.length > 0 && (
                  [...new Set(dataHotel.rooms.map((room) => room.roomType))].map((type) => (
                    <option key={type} value={type}>
                      {roomTypeMap.get(type) || type}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Zap className="w-4 h-4 inline mr-2 text-cyan-500" />
                Khoảng giá
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-400 focus:outline-none bg-white text-gray-800 transition-all hover:border-cyan-300"
              >
                <option value="all">Tất cả</option>
                <option value="low">Dưới 1.5 triệu</option>
                <option value="medium">1.5 - 2.5 triệu</option>
                <option value="high">Trên 2.5 triệu</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {!selectedHotel ? (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 border border-cyan-100/50 max-w-md mx-auto hover:border-cyan-200 transition-all shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-300 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Chưa chọn khách sạn
              </h3>
              <p className="text-gray-500">
                Vui lòng chọn điểm đến và khách sạn để xem các phòng còn trống.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-4xl font-bold text-gray-800">
                  Phòng trống tại
                </h2>
                <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  {selectedHotel.name}
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                Tìm thấy{' '}
                <span className="font-bold text-cyan-600">
                  {filteredRooms.length}
                </span>{' '}
                phòng phù hợp
              </p>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingHotel ? (
                <p className="text-gray-500">Đang tải phòng...</p>
              ) : filteredRooms?.map((room, idx) => {
                const amenities = getAmenitiesForRoom(room.roomType);
                return (
                  <div
                    key={room.id}
                    className="group bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-100/50 hover:border-cyan-300 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-200/30 hover:-translate-y-1 shadow-lg"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                    }}
                  >
                    {/* Room Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={room.image || ''}
                        alt={room.name || 'Room'}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 border border-cyan-200/50 shadow-lg">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-gray-800">{room.rating}</span>
                        <span className="text-gray-600 text-sm">({room.reviews})</span>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-400 to-emerald-400 text-white px-4 py-2 rounded-full text-xs uppercase font-bold shadow-lg">
                        {room.roomType}
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                        {room.name}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-600 mb-4 pb-4 border-b border-cyan-100/50">
                        <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{selectedCity.title}</span>
                      </div>

                      {/* Icons Row */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-cyan-100/50">
                        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                          <Users className="w-4 h-4 text-cyan-500" />
                          <span>{room.maxGuests} khách</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                          <Bed className="w-4 h-4 text-cyan-500" />
                          <span>{roomBedMap.get(room.roomType)} giường</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                          <Waves className="w-4 h-4 text-cyan-500" />
                          <span>{room.view}</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium border border-cyan-200 hover:bg-cyan-100 transition-colors"
                          >
                            {amenity}
                          </span>
                        ))}
                        {amenities.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                            +{amenities.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Price & Button */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text">
                            {formatPrice(room.pricePerNight)}
                          </div>
                          <p className="text-gray-500 text-sm">mỗi đêm</p>
                        </div>
                        <button className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-cyan-300/50 font-semibold group/btn">
                          <span className="group-hover/btn:hidden">Đặt ngay</span>
                          <span className="hidden group-hover/btn:inline">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {!isLoadingHotel && filteredRooms.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 border border-cyan-100/50 max-w-md mx-auto hover:border-cyan-200 transition-all shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-300 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Waves className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Không tìm thấy phòng phù hợp
                  </h3>
                  <p className="text-gray-500">
                    Vui lòng thử điều chỉnh bộ lọc hoặc tìm kiếm khác
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}