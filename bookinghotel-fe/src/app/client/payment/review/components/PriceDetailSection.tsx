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
              <span className="text-gray-600">Giá phòng</span>
                <span className="font-semibold text-gray-900">{  }</span>
            </div>
            <div className="text-xs text-gray-500">
              ({rooms}) phòng , ({nights} đêm)
            </div>
            <div className="flex justify-between pt-2 border-t">
        </div>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-gray-700">Tổng cộng</span>
            {/* --- MOCK DATA (BRO TỰ BỔ SUNG SAU) --- */}
          </div>
          <div className="flex justify-between items-baseline">
            {/* --- 4. SỬ DỤNG DATA TỪ REDUX --- */}
            <span className="text-sm text-gray-600">
              {rooms} phòng, {nights} đêm
            </span>
            {/* --- 5. SỬ DỤNG PROP 'price' --- */}
            <span className="text-xl font-bold text-red-500">
              {formatCurrency(Number(price))}
            </span>
          </div>
        </div>

        <button onClick={onclick} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg transition-colors mb-3">
Tiếp tục
        </button>

      <p className="text-xs text-center text-gray-600">
  Bằng việc thanh toán, bạn đồng ý với{' '}
  <a href="#" className="text-sky-600 underline">Điều khoản & Điều kiện</a>,{' '}
  <a href="#" className="text-sky-600 underline">Chính sách quyền riêng tư</a>, và{' '}
  <a href="#" className="text-sky-600 underline">Quy trình hoàn tiền chỗ ở</a> của skyvera.
</p>

      </div>
      
    </div>
  );
};

export default PriceDetailsSection;

