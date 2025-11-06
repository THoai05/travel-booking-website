'use client'

import React, { useState, useMemo } from 'react';
import { 
  Mail, User, Star, Users, Bed, Calendar, Info, ChevronDown,
  Wifi, Shield, AlertCircle, Tag, CheckCircle2,MapPin,Coffee,Phone
} from 'lucide-react';

// --- 1. IMPORT REDUX VÀ TOOLS ---
// FIX: Đổi đường dẫn alias '@' thành đường dẫn tương đối (relative)
// để trình biên dịch hiểu.
import { useAppSelector } from '@/reduxTK/hook';
import { selectSearch } from '@/reduxTK/features/searchSlice';
import { differenceInCalendarDays, parseISO } from 'date-fns';

// --- 2. CẬP NHẬT PROPS ---
// Component cha (TravelokaBookingPage) chỉ truyền 'price'
interface PriceDetailsProps {
  price: number;
  onclick:void
}

// Helper format tiền tệ
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}


const PriceDetailsSection: React.FC<PriceDetailsProps> = ({ price , onclick }) => {
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  // --- 3. LẤY DATA TỪ SEARCH SLICE ---
  const { guests, checkIn, checkOut } = useAppSelector(selectSearch);

  // Tính toán số đêm và số phòng
  const { nights, rooms } = useMemo(() => {
    try {
      const nightCount = differenceInCalendarDays(
        parseISO(checkOut),
        parseISO(checkIn)
      );
      // Đảm bảo số đêm tối thiểu là 1
      const validNights = nightCount > 0 ? nightCount : 1;
      return {
        nights: validNights,
        rooms: guests.rooms,
      };
    } catch {
      return { nights: 1, rooms: 1 }; // Fallback
    }
  }, [checkIn, checkOut, guests.rooms]);


    return (
      <div className="bg-white rounded-lg shadow-sm p-5 sticky top-4 mt-10">
    <div className="border-t pt-4">
        <button
          onClick={() => setShowPriceDetails(!showPriceDetails)}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-gray-600" />
            <span className="font-bold text-gray-900">Thông tin thanh toán</span>
          </div>
          <ChevronDown size={20} className={`transition-transform ${showPriceDetails ? 'rotate-180' : ''}`} />
        </button>

        {showPriceDetails && (
          <div className="space-y-3 mb-4 text-sm">
            {/* --- MOCK DATA (BRO TỰ BỔ SUNG SAU) --- */}
            <div className="flex justify-between">
              <span className="text-gray-600">giá phòng</span>
              <span className="font-semibold text-gray-900">359.036 VND</span>
            </div>
            <div className="text-xs text-gray-500">
              ({rooms}) phòng , ({nights} đêm)
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Thuế và phí</span>
              <span className="font-semibold text-gray-900">55.650 VND</span>
VND          </div>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-gray-700">Tổng cộng</span>
            {/* --- MOCK DATA (BRO TỰ BỔ SUNG SAU) --- */}
            <span className="text-gray-400 line-through text-sm">432.363 VND</span>
          </div>
          <div className="flex justify-between items-baseline">
            {/* --- 4. SỬ DỤNG DATA TỪ REDUX --- */}
            <span className="text-sm text-gray-600">
              {rooms} phòng, {nights} đêm
            </span>
            {/* --- 5. SỬ DỤNG PROP 'price' --- */}
            <span className="text-xl font-bold text-red-500">
              {formatCurrency(price)}
            </span>
          </div>
        </div>

        <button onClick={onclick} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors mb-3">
Tiếp tục
        </button>

      <p className="text-xs text-center text-gray-600">
  Bằng việc thanh toán, bạn đồng ý với{' '}
  <a href="#" className="text-blue-600 underline">Điều khoản & Điều kiện</a>,{' '}
  <a href="#" className="text-blue-600 underline">Chính sách quyền riêng tư</a>, và{' '}
  <a href="#" className="text-blue-600 underline">Quy trình hoàn tiền chỗ ở</a> của Bluevera.
</p>

      </div>
      <div className="mt-4 pt-4 border-t space-y-2">
        {/* --- MOCK DATA (BRO TỰ BỔ SUNG SAU) --- */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <Star size={12} fill="white" className="text-white" />
          </div>
          <span className="text-gray-700">Được thưởng 1,451 điểm</span>
       </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <Star size={12} fill="white" className="text-white" />
          </div>
          <span className="text-gray-700">Được thưởng 497,623 thành viên</span>
       </div>
      </div>
    </div>
  );
};

export default PriceDetailsSection;

