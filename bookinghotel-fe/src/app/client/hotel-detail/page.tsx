'use client';

import { useState } from 'react';
import { Star, MapPin, Wifi, Utensils, Dumbbell, Wind, Users, Heart, Share2, Phone, Mail, Clock, MapPin as LocationIcon } from 'lucide-react';

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

  const amenities = [
    { icon: Wifi, name: 'WiFi miễn phí', desc: 'Tốc độ cao 100Mbps' },
    { icon: Utensils, name: 'Nhà hàng 24h', desc: 'Ăn uống bất cứ lúc nào' },
    { icon: Dumbbell, name: 'Phòng gym', desc: 'Trang thiết bị hiện đại' },
    { icon: Wind, name: 'Điều hòa cao cấp', desc: 'Thoải mái cả ngày' },
  ];

  const rooms = [
    { type: 'Phòng đơn', price: 1500000, capacity: 1, desc: 'Giường đôi, view thành phố' },
    { type: 'Phòng đôi', price: 2500000, capacity: 2, desc: 'Giường king, view biển' },
    { type: 'Phòng gia đình', price: 4000000, capacity: 4, desc: 'Phòng ngủ riêng, phòng khách' },
  ];

  const reviews = [
    { name: 'Nguyễn Văn A', rating: 5, text: 'Khách sạn rất sạch sẽ, nhân viên thân thiện. Tôi sẽ quay lại!', date: 'Tháng 10, 2025' },
    { name: 'Trần Thị B', rating: 5, text: 'Dịch vụ xuất sắc, ăn uống ngon. Vị trí đẹp bên biển!', date: 'Tháng 9, 2025' },
    { name: 'Lê Văn C', rating: 4, text: 'Tuyệt vời, chỉ mong giá rẻ hơn một chút.', date: 'Tháng 9, 2025' },
    { name: 'Phạm Thị D', rating: 5, text: 'Phòng spacious, đẹp lắm. Sẽ giới thiệu cho bạn bè!', date: 'Tháng 8, 2025' },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotelImages.length) % hotelImages.length);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0faf9' }}>
      {/* Image Carousel */}
      <section className="relative h-96 overflow-hidden bg-gradient-to-r from-cyan-100 to-teal-50">
        <img
          src={hotelImages[currentImageIndex]}
          alt="hotel"
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition shadow-lg"
        >
          <svg className="w-6 h-6" style={{ color: '#84f0ff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition shadow-lg"
        >
          <svg className="w-6 h-6" style={{ color: '#84f0ff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-white bg-opacity-60 px-4 py-2 rounded-full">
          {hotelImages.map((_, idx) => (
            <div
              key={idx}
              className="h-2 rounded-full transition cursor-pointer"
              onClick={() => setCurrentImageIndex(idx)}
              style={{
                width: idx === currentImageIndex ? '24px' : '8px',
                backgroundColor: idx === currentImageIndex ? '#84f0ff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Info Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {/* Rating & Location */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span style={{ color: '#475569' }}>4.8 (2,340 đánh giá)</span>
              </div>
              <div className="flex gap-2" style={{ color: '#06b6d4' }}>
                <MapPin size={20} />
                <span className="font-semibold">Bãi biển Miền Trung</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 border transition hover:shadow-lg" style={{ borderColor: '#84f0ff50' }}>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#0891b2' }}>Về khách sạn</h2>
              <p style={{ color: '#475569' }} className="leading-relaxed mb-6 text-lg">
                Luxury Sea View Hotel là điểm đến lý tưởng cho những ai muốn tận hưởng kỳ nghỉ đẹp nhất với vẻ đẹp tự nhiên và dịch vụ hạng sang. Khách sạn nằm trên bãi biển riêng với tầm nhìn toàn cảnh biển xanh, sân vườn lớn và tiện nghi đầy đủ.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: '#84f0ff30' }}>
                <div className="flex gap-3">
                  <Clock size={24} style={{ color: '#84f0ff' }} />
                  <div>
                    <p className="font-semibold" style={{ color: '#0891b2' }}>Giờ hoạt động</p>
                    <p style={{ color: '#64748b' }}>Check-in: 14:00</p>
                    <p style={{ color: '#64748b' }}>Check-out: 11:00</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={24} style={{ color: '#84f0ff' }} />
                  <div>
                    <p className="font-semibold" style={{ color: '#0891b2' }}>Liên hệ</p>
                    <p style={{ color: '#64748b' }}>+84 987 654 321</p>
                    <p style={{ color: '#64748b' }}>info@hotelbiển.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-8 rounded-2xl p-8 transition" style={{ backgroundColor: '#f0faf950' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#0891b2' }}>Tiện nghi nổi bật</h3>
              <div className="grid grid-cols-2 gap-6">
                {amenities.map((amenity, idx) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white border transition hover:shadow-md" style={{ borderColor: '#84f0ff30' }}>
                      <Icon size={32} style={{ color: '#84f0ff', flexShrink: 0 }} />
                      <div>
                        <p className="font-semibold" style={{ color: '#0891b2' }}>{amenity.name}</p>
                        <p style={{ color: '#64748b' }} className="text-sm">{amenity.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="rounded-2xl p-8 border-2 h-fit sticky top-32 shadow-lg" style={{ backgroundColor: '#ffffff', borderColor: '#84f0ff' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#0891b2' }}>Đặt phòng ngay</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0891b2' }}>Ngày check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{ borderColor: '#84f0ff', focusRingColor: '#84f0ff' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0891b2' }}>Ngày check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{ borderColor: '#84f0ff' }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#0891b2' }}>
                  <Users size={18} />
                  Số khách
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{ borderColor: '#84f0ff' }}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} khách</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 pb-2 border-t" style={{ borderColor: '#84f0ff30' }}>
                <div className="flex justify-between mb-3" style={{ color: '#475569' }}>
                  <span>Giá cơ bản:</span>
                  <span className="font-semibold">2.500.000 VNĐ</span>
                </div>
                <div className="flex justify-between mb-3" style={{ color: '#475569' }}>
                  <span>Số đêm:</span>
                  <span className="font-semibold">5 đêm</span>
                </div>
                <div className="flex justify-between pt-3 border-t" style={{ borderColor: '#84f0ff30', color: '#0891b2' }}>
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-lg">12.500.000 VNĐ</span>
                </div>
              </div>

              <button className="w-full text-white font-bold py-3 rounded-lg hover:opacity-90 transition text-lg" style={{ backgroundColor: '#84f0ff' }}>
                Tiếp tục đặt phòng
              </button>
              <button className="w-full border-2 font-semibold py-2 rounded-lg hover:bg-gray-50 transition" style={{ borderColor: '#84f0ff', color: '#0891b2' }}>
                Hỏi đáp
              </button>
            </div>
          </div>
        </div>

        {/* Room Types */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#0891b2' }}>Loại phòng có sẵn</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((room, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border transition hover:shadow-lg hover:scale-105" style={{ borderColor: '#84f0ff30' }}>
                <div className="h-48 bg-gradient-to-br from-cyan-200 to-teal-100" />
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2" style={{ color: '#0891b2' }}>{room.type}</h4>
                  <p style={{ color: '#64748b' }} className="text-sm mb-4">{room.desc}</p>
                  <p className="text-sm mb-4 flex items-center gap-2" style={{ color: '#06b6d4' }}>
                    <Users size={16} />
                    Tối đa {room.capacity} khách
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: '#84f0ff' }}>
                        {(room.price / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs" style={{ color: '#64748b' }}>/đêm</p>
                    </div>
                    <button className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition text-sm font-semibold" style={{ backgroundColor: '#84f0ff' }}>
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
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#0891b2' }}>Đánh giá từ khách</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border transition hover:shadow-lg" style={{ borderColor: '#84f0ff30' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold" style={{ color: '#0891b2' }}>{review.name}</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>{review.date}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p style={{ color: '#475569' }} className="leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}