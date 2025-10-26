'use client'

import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Bookmark, MapPin, Star, Ticket } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';


// -----------------------------------------------------------------
// 1. ĐÂY LÀ INTERFACE TỪ BACKEND (data thực tế)
export interface BackendHotel {
  id: number; // Backend là number
  name: string;
  avgPrice: string; // Backend là string
  city: {
    id: number;
    title: string;
  };
  avgRating: string | null; // Backend là string
  reviewCount: number;
  amenities: string; // Backend là string "a,b,c"
}

// 2. ĐÂY LÀ INTERFACE FRONTEND MÀ COMPONENT CẦN (từ code của bro)
export interface HotelDisplay {
  id: string; // FE cần string
  name: string;
  rating: number; // FE cần number
  reviewCount: number;
  ratingLabel: string;
  category: string;
  stars: number;
  badge?: string;
  location: string;
  amenities: string[]; // FE cần mảng string
  points: number;
  couponText?: string;
  tag?: string;
  originalPrice?: number;
  currentPrice: number; // FE cần number
  roomsLeft?: number;
  images: string[];
}

// 3. PROPS CỦA COMPONENT SẼ NHẬN VÀO DATA TỪ BACKEND
interface HotelCardProps {
  hotel: BackendHotel; // <-- Thay đổi quan trọng: Nhận vào data backend
  onSelectRoom?: (hotelId: string) => void;
}

// HÌNH ẢNH TEXT CỨNG (vì backend chưa có)
const HARDCODED_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
];
// -----------------------------------------------------------------


export const HotelCard: React.FC<HotelCardProps> = ({ hotel: backendHotel, onSelectRoom }) => {
  
  // 4. LOGIC BIẾN ĐỔI DATA TỪ BACKEND -> FRONTEND
  const hotel: HotelDisplay = {
    // --- Data có từ Backend ---
    id: backendHotel.id.toString(),
    name: backendHotel.name,
    rating: Number(backendHotel.avgRating || 0), // Chuyển string "3.6" -> number 3.6
    reviewCount: backendHotel.reviewCount,
    location: backendHotel.city.title,
    currentPrice: Number(backendHotel.avgPrice), // Chuyển string "1222000.00" -> number
    amenities: backendHotel.amenities ? backendHotel.amenities.split(',') : ["(Chưa có tiện ích)"], // Chuyển string "a,b,c" -> mảng ["a", "b", "c"]
    
    // --- Data CHƯA CÓ (Text cứng) ---
    images: HARDCODED_IMAGES,
    ratingLabel: "Tuyệt vời", // <-- Text cứng
    category: "Khách sạn", // <-- Text cứng
    stars: 4, // <-- Text cứng (Bro có thể dùng Math.round(Number(backendHotel.avgRating)) nếu muốn)
    badge: "Giảm giá đặc biệt", // <-- Text cứng
    points: 1222, // <-- Text cứng (tạm lấy theo giá)
    couponText: "Giảm 15%", // <-- Text cứng
    tag: "Yêu thích", // <-- Text cứng
    originalPrice: Number(backendHotel.avgPrice) * 1.25, // <-- Text cứng (tạm tính)
    roomsLeft: 3, // <-- Text cứng
  };

  const router = useRouter()

  // --- Logic của component (giữ nguyên) ---
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleSelectRoom = () => {
    // 'hotel.id' bây giờ đã là string, hoàn toàn chính xác
    onSelectRoom?.(hotel.id);
  };

  // 5. PHẦN JSX RENDER (KHÔNG CẦN THAY ĐỔI GÌ)
  // Toàn bộ JSX bên dưới đã khớp với object 'hotel' (kiểu HotelDisplay)
  // mà chúng ta vừa tạo ra ở trên.
  return (
    <div onClick={()=>router.push(`/hotel-detail/${hotel.id}`)} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image Gallery Section */}
        <div className="relative w-full sm:w-80 flex-shrink-0">
          <button
            onClick={handleBookmark}
            className="absolute top-3 right-3 z-10 bg-white rounded p-1.5 shadow-md hover:bg-gray-50 transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 ${
                isBookmarked ? 'fill-orange-500 text-orange-500' : 'text-gray-600'
              }`}
            />
          </button>

          <div className="relative w-full h-48 bg-gray-200">
            <ImageWithFallback
              src={hotel.images[currentImageIndex]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100">
            {hotel.images.slice(0, 3).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-16 overflow-hidden rounded ${
                  currentImageIndex === index ? 'ring-2 ring-sky-500' : ''
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${hotel.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="flex-1 font-extrabold">{hotel.name}</h3>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-sky-500 text-sky-500" />
                  <span className="text-sky-600">
                    {hotel.rating*2}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({hotel.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-600">{hotel.ratingLabel}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <span className="text-sky-600">🏨</span>
                {hotel.category}
              </Badge>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: Math.floor(Number(hotel.rating)) }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {hotel.badge && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {hotel.badge}
                </Badge>
              )}
            </div>

            <div className="flex items-start gap-1 mb-3">
              <MapPin className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-700">{hotel.location}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {hotel.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded"
                >
                  {amenity}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-600">⚡</span>
                <span className="text-gray-700">{hotel.points.toLocaleString()} Points</span>
              </div>
              {hotel.couponText && (
                <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
                  <Ticket className="w-3 h-3 mr-1" />
                  {hotel.couponText}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 pt-3 border-t sm:pt-0 sm:border-t-0 sm:border-l sm:pl-4 sm:w-56 flex-shrink-0">
            <div className="flex flex-col items-end">
              {hotel.tag && (
                <Badge className="bg-sky-500 text-white hover:bg-sky-600 mb-2">
                  {hotel.tag}
                </Badge>
              )}
              <div className="flex flex-col items-end">
                {hotel.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {hotel.originalPrice.toLocaleString()} VND
                  </span>
                )}
                <span className="text-orange-600 text-xl">
                  {hotel.currentPrice.toLocaleString()} VND
                </span>
                {hotel.roomsLeft && (
                  <span className="text-xs text-orange-600">
                    Only {hotel.roomsLeft} room(s) left at this price!
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={handleSelectRoom}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 w-full"
            >
              Chọn khách sạn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};