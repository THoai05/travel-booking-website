'use client';

import { useState } from 'react';
import { Star, MapPin, Wifi, Utensils, Dumbbell, Wind, Users, Heart, Share2, Phone, Mail, Clock, MapPin as LocationIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useHandleHotelById } from '@/service/hotels/hotelService';

export default function HotelDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState('2025-01-20');
  const [checkOut, setCheckOut] = useState('2025-01-25');
  const [isLiked, setIsLiked] = useState(false);

  const hotelImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1631049307038-da5ec5d79645?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719570160-91ec354bcf8f?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop',
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotelImages.length) % hotelImages.length);
  };

  const params = useParams()
  const id = Number(params.id)
  const { data: hotelData } = useHandleHotelById(id)
  
  const amenities = hotelData?.amenities;
  const rooms = hotelData?.rooms
  const reviews = hotelData?.reviews

  const roomTypeMap = new Map<string, string>([
    ["deluxe", "Deluxe"],
    ["single", "Single",],
    ["double","Double"]
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cyan-50/40 to-white">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/20 to-blue-100/10 rounded-full blur-3xl -z-10" />

      {/* Image Carousel */}
      <section className="relative h-screen max-h-96 overflow-hidden bg-gradient-to-br from-cyan-100 via-blue-50 to-cyan-50">
        <img
          src={hotelImages[currentImageIndex]}
          alt="hotel"
          className="w-full h-full object-cover transition-all duration-500"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md hover:bg-white shadow-xl p-3 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
        >
          <ChevronLeft size={24} className="text-cyan-600" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md hover:bg-white shadow-xl p-3 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
        >
          <ChevronRight size={24} className="text-cyan-600" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-white/70 backdrop-blur-md px-5 py-3 rounded-full shadow-lg">
          {hotelImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === currentImageIndex 
                  ? 'bg-cyan-500 w-7 h-3' 
                  : 'bg-white/60 hover:bg-white/80 w-3 h-3'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>

        {/* Heart & Share buttons */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="bg-white/80 backdrop-blur-md hover:bg-white shadow-lg p-3 rounded-full transition-all hover:scale-110 active:scale-95"
          >
            <Heart size={22} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
          <button className="bg-white/80 backdrop-blur-md hover:bg-white shadow-lg p-3 rounded-full transition-all hover:scale-110 active:scale-95">
            <Share2 size={22} className="text-cyan-600" />
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Info Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {/* Rating & Location */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-cyan-200/50">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(Number(Math.floor(hotelData?.avgRating||0)))].map((_, i) => (
                    <Star key={i} size={22} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">{ hotelData?.avgRating } ({hotelData?.reviewCount || 0} đánh giá)</span>
              </div>
              <div className="flex gap-2 text-cyan-600 font-semibold items-center">
                <MapPin size={20} className="text-cyan-500" />
                <span>{hotelData?.city.title}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-cyan-200/50 shadow-lg hover:shadow-xl transition-all mb-8">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                🏨 Về khách sạn
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8 text-lg font-medium">
                {hotelData?.description}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-cyan-200/50">
                <div className="flex gap-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl h-fit">
                    <Clock size={24} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-bold text-cyan-700 mb-1">Giờ hoạt động</p>
                    <p className="text-sm text-gray-600">Check-in: {hotelData?.checkInTime }</p>
                    <p className="text-sm text-gray-600">Check-out: {hotelData?.checkOutTime }</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl h-fit">
                    <Phone size={24} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-bold text-cyan-700 mb-1">Liên hệ</p>
                    <p className="text-sm text-gray-600">{hotelData?.phone }</p>
                    <p className="text-sm text-gray-600">info@hotelbiển.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gradient-to-br from-cyan-50/80 to-blue-50/50 backdrop-blur-sm rounded-3xl p-8 border border-cyan-200/50 shadow-lg">
              <h3 className="text-3xl font-bold mb-8 text-cyan-700">✨ Tiện nghi nổi bật</h3>
              <div className="grid grid-cols-2 gap-5">
                {amenities?.map((amenity, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-cyan-200/50 hover:shadow-lg hover:border-cyan-300 transition-all hover:scale-105"
                  >
                    <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg h-fit flex-shrink-0">
                      <Wifi size={20} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-bold text-cyan-700">{amenity.name}</p>
                      <p className="text-sm text-gray-600">{amenity.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="rounded-3xl p-8 border-2 border-cyan-300/60 h-fit sticky top-32 shadow-2xl bg-white/80 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              💳 Đặt phòng ngay
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-cyan-700 mb-2">📅 Ngày check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-cyan-300/50 bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-cyan-700 mb-2">📅 Ngày check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-cyan-300/50 bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-cyan-700 mb-2 flex items-center gap-2">
                  <Users size={18} />
                  Số khách
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-cyan-300/50 bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-medium"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} khách</option>
                  ))}
                </select>
              </div>

              <div className="pt-6 pb-2 border-t-2 border-cyan-200/50 space-y-3">
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>💰 Giá cơ bản:</span>
                  <span className="font-bold text-cyan-700">2.500.000 VNĐ</span>
                </div>
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>🌙 Số đêm:</span>
                  <span className="font-bold text-cyan-700">5 đêm</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-cyan-200/50 text-cyan-700">
                  <span className="font-bold text-lg">Tổng cộng:</span>
                  <span className="font-bold text-xl">12.500.000 VNĐ</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-lg">
                Tiếp tục đặt phòng
              </button>
              <button className="w-full border-2 border-cyan-400 text-cyan-700 font-bold py-3 rounded-xl hover:bg-cyan-50/80 transition-all">
                ❓ Hỏi đáp
              </button>
            </div>
          </div>
        </div>

        {/* Room Types */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-cyan-700">🛏️ Loại phòng có sẵn</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms?.map((room, idx) => (
              <div 
                key={idx} 
                className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-cyan-200/50 hover:shadow-2xl hover:scale-105 transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-cyan-200/60 via-blue-100/40 to-cyan-100/60 flex items-center justify-center">
                  <div className="text-6xl">🏨</div>
                </div>
                <div className="p-6">
                  <h4 className="text-2xl font-bold mb-2 text-cyan-700">{roomTypeMap.get(room.roomType)}</h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{room.desc}</p>
                  <p className="text-sm mb-5 flex items-center gap-2 text-cyan-600 font-semibold">
                    <Users size={16} />
                    Tối đa {room.maxGuests} khách
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-cyan-600">
                        {Number(room?.pricePerNight ?? 0).toLocaleString('vi-VN')}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">VND/đêm</p>
                    </div>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl hover:shadow-lg transition-all active:scale-95 text-sm font-bold shadow-md">
                      Chọn
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-cyan-700">⭐ Đánh giá từ khách</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reviews?.map((review, idx) => (
              <div 
                key={idx} 
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-2 border-cyan-200/50 hover:shadow-lg hover:border-cyan-300 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-cyan-700">{review.user.username}</p>
                    <p className="text-xs text-gray-500 font-medium">{review.date}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}