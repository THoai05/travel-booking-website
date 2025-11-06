'use client'
import React from 'react';
import { 
  Clock, Info, Wifi, Users, Bed, Coffee, 
  MapPin, Phone, Mail, CheckCircle2, ChevronDown 
} from 'lucide-react';

// --- (SỬA) ---
// 1. Interface này đã được cập nhật để khớp chính xác
// với object `hotelDetailsProps` bạn tạo ra trong useMemo.
interface HotelSummaryProps {
  bookingId: string; // useMemo đã dùng toString()
  name: string;
  checkIn: string;   // Ngày đã format
  checkOut: string;  // Ngày đã format
  nights: number;
  roomType: string;
  guests: number;
  bedType: string;
  contactFullName?: string;
  contactEmail?: string;
  contactPhone?: string;
  guestsFullName?: string;
  breakfast: boolean;
  wifi: boolean;
}

// --- (SỬA) ---
// 2. Kiểu prop đã đổi thành HotelSummaryProps | null
// vì useMemo có thể trả về null
const HotelSummaryCard: React.FC<{ hotel: HotelSummaryProps | null; }> = ({ hotel }) => {

  console.log("O trang checkout",hotel)
  
  // --- (SỬA) ---
  // 3. Thêm
  // Bắt buộc phải có đoạn kiểm tra null này,
  // vì useMemo sẽ trả về null nếu pendingBooking chưa có
  if (!hotel) {
    // Bạn có thể hiển thị một bộ xương (skeleton) loading ở đây
    return (
      <div className="bg-sky-50 rounded-lg p-5 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="border-t pt-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Nếu hotel không null, hiển thị thẻ tóm tắt
  return (
    <div className="bg-sky-50 rounded-lg p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Hotel Summary</h3>
          <p className="text-xs text-gray-600">Booking ID: {hotel.bookingId}</p>
        </div>
      </div>

      <h2 className="font-bold text-gray-900 mb-4">{hotel.name}</h2>

      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-xs text-gray-600">Check-in</p>
          <p className="font-semibold text-sm">{hotel.checkIn}</p>
          <p className="text-xs text-gray-500">From 14:00</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">{hotel.nights} {hotel.nights > 1 ? 'nights' : 'night'}</p>
          <div className="my-1">→</div>
        </div>
        <div>
          <p className="text-xs text-gray-600">Check-out</p>
          <p className="font-semibold text-sm">{hotel.checkOut}</p>
          <p className="text-xs text-gray-500">Before 12:00</p>
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <p className="font-semibold text-sm">{hotel.roomType}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users size={16} />
          <span>{hotel.guests} Guests</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Bed size={16} />
          <span>{hotel.bedType}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Coffee size={16} />
          {/* Component này đã xử lý đúng `breakfast` từ prop */}
          <span>{hotel.breakfast ? 'Breakfast included' : 'Breakfast not included'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Wifi size={16} />
          {/* --- (SỬA) --- */}
          {/* 4. Chuyển từ text cứng "Free WiFi" sang dùng prop */}
          <span>{hotel.wifi ? 'Free WiFi' : 'WiFi not available'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-semibold mb-2">Guest(s)</p>
        {/* --- (SỬA) --- */}
        {/* 5. Lấy từ prop `hotel`, không dùng biến `guest` */}
        <p className="text-sm text-gray-700">{hotel.guestsFullName}</p>
        
        {/* Các dòng text cứng này là OK vì nó là chính sách */}
        <div className="flex gap-2 mt-2">
          <span className="text-xs flex items-center gap-1">
            <CheckCircle2 size={14} className="text-gray-500" />
            Non-refundable
          </span>
          <span className="text-xs flex items-center gap-1">
            <CheckCircle2 size={14} className="text-gray-500" />
            Non-reschedulable
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-semibold mb-2">Contact Details</p>
        
        {/* --- (SỬA) --- */}
        {/* 6. Lấy từ prop `hotel`, không dùng biến `guest` */}
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Users size={14} />
          {hotel.contactFullName}
        </p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Phone size={14} />
          {hotel.contactPhone}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2 break-all">
          <Mail size={14} />
          {hotel.contactEmail}
        </p>
      </div>
    </div>
  );
}
export default HotelSummaryCard;