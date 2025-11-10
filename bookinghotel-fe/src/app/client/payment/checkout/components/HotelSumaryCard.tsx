'use client'
import React from 'react';
import { 
  Clock, Info, Wifi, Users, Bed, Coffee, 
  MapPin, Phone, Mail, CheckCircle2, ChevronDown 
} from 'lucide-react';

interface HotelSummaryProps {
  bookingId: string;
  name: string;
  checkIn: string;
  checkOut: string;
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

const HotelSummaryCard: React.FC<{ hotel: HotelSummaryProps | null; }> = ({ hotel }) => {

  console.log("O trang checkout", hotel)
  
  // 1. Giữ nguyên bộ xương loading khi hotel là null
  if (!hotel) {
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

  // 2. Dịch các text cứng sang tiếng Việt
  return (
    <div className="bg-sky-50 rounded-lg p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Tóm tắt khách sạn</h3>
          <p className="text-xs text-gray-600">Mã đặt phòng: {hotel.bookingId}</p>
        </div>
      </div>

      <h2 className="font-bold text-gray-900 mb-4">{hotel.name}</h2>

      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-xs text-gray-600">Nhận phòng</p>
          <p className="font-semibold text-sm">{hotel.checkIn}</p>
          <p className="text-xs text-gray-500">Từ 14:00</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">{hotel.nights} đêm</p>
          <div className="my-1">→</div>
        </div>
        <div>
          <p className="text-xs text-gray-600">Trả phòng</p>
          <p className="font-semibold text-sm">{hotel.checkOut}</p>
          <p className="text-xs text-gray-500">Trước 12:00</p>
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <p className="font-semibold text-sm">{hotel.roomType}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users size={16} />
          <span>{hotel.guests} khách</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Bed size={16} />
          <span>{hotel.bedType}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Coffee size={16} />
          <span>{hotel.breakfast ? 'Bao gồm bữa sáng' : 'Không bao gồm bữa sáng'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Wifi size={16} />
          <span>{hotel.wifi ? 'WiFi miễn phí' : 'Không có WiFi'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-semibold mb-2">Khách</p>
        <p className="text-sm text-gray-700">{hotel.guestsFullName}</p>
        
        <div className="flex gap-2 mt-2">
          <span className="text-xs flex items-center gap-1">
            <CheckCircle2 size={14} className="text-gray-500" />
            Không hoàn tiền
          </span>
          <span className="text-xs flex items-center gap-1">
            <CheckCircle2 size={14} className="text-gray-500" />
            Không thể đổi lịch
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-semibold mb-2">Chi tiết liên hệ</p>
        
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