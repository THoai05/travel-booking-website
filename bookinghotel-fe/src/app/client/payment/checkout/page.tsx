'use client'
import React, { useState, useEffect,useMemo } from 'react';
import { Clock, Info, Wifi, Users, Bed, Coffee, MapPin, Phone, Mail, CheckCircle2, ChevronDown } from 'lucide-react';
import PaymentMethodOption from './components/PaymentMethodOption';
import HotelSummaryCard from './components/HotelSumaryCard';
import { selectBooking } from "@/reduxTK/features/bookingSlice";
import { useAppSelector, useAppDispatch } from "@/reduxTK/hook";
import { format, differenceInCalendarDays, parseISO } from "date-fns";
import api from '@/axios/axios';


// Main Component
const TravelokaPaymentPage: React.FC = () => {
   // Helper format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  // Đã dịch các badge
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'vnpay',
      name: 'VNPay',
      badge: 'Tận hưởng ưu đãi!',
      icons: ['VietQR'],
    },
    {
      id: 'momo',
      name: 'Momo',
      badge: 'Các bước thanh toán dễ dàng và xác minh nhanh hơn',
      icons: ['VietinBank'],
    },
    {
      id: 'zalopay',
      name: 'Zalo Pay',
      icons: ['Pay', 'Zalo', 'SPay'],
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icons: [],
    }
  ];




   
   const formatDate = (dateString: string) => {
       try {
         // parseISO vì date của bro là "2025-11-10"
   
         return format(parseISO(dateString), "EEE, dd MMMM yyyy");
       } catch {
         return dateString;
       }
     };
   const { pendingBooking } = useAppSelector(selectBooking);
   console.log(pendingBooking)

   const hotelDetailsProps = useMemo(() => {
       if (!pendingBooking) return null;
   
       // Đảm bảo tính toán nights > 0
   
       let nights = 1;
   
       try {
         nights = differenceInCalendarDays(
           parseISO(pendingBooking.checkoutDate),
   
           parseISO(pendingBooking.checkinDate)
         );
   
         if (nights <= 0) nights = 1; // Fallback
       } catch {}
   
       return {
         bookingId: pendingBooking.bookingId.toString(),
   
         name: "Pariat River Front Hotel Da Nang", // <-- Bro nói text cứng (Tên riêng, giữ nguyên)
   
         checkIn: formatDate(pendingBooking.checkinDate),
   
         checkOut: formatDate(pendingBooking.checkoutDate),
   
         nights: nights,
   
         roomType: `(1x) ${pendingBooking.roomName}`,
   
         guests: pendingBooking.guestsCount, // Lấy từ booking
   
         // guests: searchGuests.adults + searchGuests.children, // Hoặc lấy từ search
   
         bedType: pendingBooking.bedType,

         contactFullName:pendingBooking.contactFullName,
         contactEmail:pendingBooking.contactEmail,
         contactPhone:pendingBooking.contactPhone,
         guestsFullName:pendingBooking.guestsFullName,
   
         breakfast: false, // <-- Bro nói text cứng
   
         wifi: true, // <-- Bro nói text cứng
       };
   }, [pendingBooking]);
   

   const handlePayment = async (paymentMethod:string) => {
     const response = await api.get(`payment-gate/${paymentMethod}`, {
       params: {
         orderAmount: Number(pendingBooking?.totalPrice),
         orderCode:pendingBooking?.bookingId.toString()
       }
     })
     window.location.href = response.data
   }
   
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="text-sky-600 font-bold text-2xl">Bluevera</div>
            <div className="w-6 h-6 bg-sky-500 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Timer Banner */}
    

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Bạn muốn trả theo hình thức nào ?</h2>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Info size={16} />
                  <span>Thanh toán an toàn</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <PaymentMethodOption
                    key={method.id}
                    method={method}
                    selected={selectedPayment === method.id}
                    onSelect={() => setSelectedPayment(method.id)}
                  />
                ))}
              </div>

              {/* VietQR Instructions (Đã dịch) */}
              {selectedPayment === 'vietqr' && (
                <div className="mt-4 bg-sky-50 border border-sky-200 rounded-lg p-4">
                  <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                    <li>Đảm bảo bạn có ví điện tử hoặc ứng dụng ngân hàng di động hỗ trợ thanh toán bằng VietQR.</li>
                    <li>Một mã QR sẽ xuất hiện sau khi bạn nhấp vào nút 'Thanh toán'. Chỉ cần lưu hoặc chụp ảnh màn hình mã QR để hoàn tất thanh toán trong thời gian quy định.</li>
                    <li>Vui lòng sử dụng mã QR mới nhất được cung cấp để hoàn tất thanh toán của bạn.</li>
                  </ul>
                </div>
              )}

              {/* Coupon Section (Đã dịch) */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="flex items-center justify-between w-full text-sky-600 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Info size={18} />
                    <span>Áp dụng Mã giảm giá</span>
                  </div>
                  <span className="text-sky-600">Áp dụng</span>
                </button>
                {showCoupon && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá hoặc chọn mã có sẵn"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Points Section (Đã dịch) */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={1} className="text-yellow-600" />
                  <span className="font-semibold text-gray-800">Đổi điểm Bluevera</span>
                  <Info size={16} className="text-gray-400" />
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-1 ml-7">Điểm của bạn: 300</p>

              {/* Total Price (Đã dịch) */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">Tổng tiền</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(Number(pendingBooking?.totalPrice))}</span>
                    <ChevronDown size={20} className="text-gray-600" />
                  </div>
                </div>

                {/* Đã sửa text nút này */}
                <button onClick={()=>handlePayment(selectedPayment)} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors">
                  Tiến hành thanh toán
                </button>

                {/* Đã dịch "and" và "Privacy Policy" */}
                <p className="text-xs text-center text-gray-600 mt-3">
                  Bạn đang đồng ý với{' '}
                  <a href="#" className="text-sky-600 underline">Chính sách và điều kiện của Bluvera</a>{' '}
                  và <a href="#" className="text-sky-600 underline">Chính sách bảo mật</a>.
                </p>
              </div>

              {/* Rewards (Đã dịch) */}
              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-600">
                  <Info size={16} />
                  <span>Cộng thêm 1,336 điểm Bluevera</span>
                </div>
                <div className="flex items-center gap-1 text-sky-600">
                  <Info size={16} />
                  <span>Nhận 497.623 Sao Ưu Tiên</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hotel Summary */}
          <div className="lg:col-span-1">
            {/* LƯU Ý: Component HotelSummaryCard được import từ file khác.
              Nếu bên trong nó có text tiếng Anh (ví dụ: "Check-in", "Guests"),
              bro sẽ cần phải dịch cả file: ./components/HotelSumaryCard
            */}
            <HotelSummaryCard hotel={hotelDetailsProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelokaPaymentPage;