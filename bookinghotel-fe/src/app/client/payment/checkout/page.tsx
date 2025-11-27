'use client'
import React, { useState, useEffect,useMemo } from 'react';
import { Clock, Info, Wifi, Users, Bed, Coffee, MapPin, Phone, Mail, CheckCircle2, ChevronDown ,Ticket} from 'lucide-react';
import PaymentMethodOption from './components/PaymentMethodOption';
import HotelSummaryCard from './components/HotelSumaryCard';
import { selectBooking } from "@/reduxTK/features/bookingSlice";
import { useAppSelector, useAppDispatch } from "@/reduxTK/hook";
import { format, differenceInCalendarDays, parseISO } from "date-fns";
import api from '@/axios/axios';
import { useHandleRandomCouponByTitle } from '@/service/coupon/couponService';
import { setPendingBooking , fetchBookingById} from '@/reduxTK/features/bookingSlice';


// Main Component
const TravelokaPaymentPage: React.FC = () => {
   // Helper format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
  const dispatch = useAppDispatch()
  
     useEffect(() => {
    const bookingIdStr = sessionStorage.getItem("activeBookingId");
    if (bookingIdStr) {
      const bookingId = Number(bookingIdStr);
      dispatch(fetchBookingById(bookingId));
    }
  }, [dispatch]);
  
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const { data: couponData, error: couponError, isLoading: couponIsLoading } = useHandleRandomCouponByTitle(selectedPayment)
  
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [selectedCouponCode, setSelectedCouponeCode] = useState<string>('')
  const { pendingBooking } = useAppSelector(selectBooking);
  console.log(pendingBooking)
  
  const [totalPrice, setTotalPrice] = useState<number>(pendingBooking?.totalPrice ?? 0)
  
  
  console.log(totalPrice)

useEffect(() => {
  const handler = setTimeout(() => {
    if (pendingBooking?.bookingId) {
      
      const applyCoupon = async () => {
        try {
          const response = await api.patch(
            `bookings/${pendingBooking.bookingId}`,
            {
              couponId: selectedCouponId,
            }
          );
          
          if (response.data.message === "success") {
             
            const bookingData = response.data.updateData
            
            dispatch(setPendingBooking(bookingData))
            const finalPrice = bookingData.totalPriceUpdate !== null 
            ? bookingData.totalPriceUpdate 
            : bookingData.totalPrice;
            setTotalPrice(finalPrice);
              }

        } catch (error) {
          console.error('Lỗi áp dụng coupon:', error);
        }
      };
      applyCoupon();
    }
  }, 1000);


  return () => {
    clearTimeout(handler);
  };

}, [selectedCouponId, pendingBooking?.bookingId]); 


  const handleCouponCode = async () => {
    if (selectedCouponCode === "") {
      return null
    }
      try {
          const response = await api.patch(
            `bookings/${pendingBooking.bookingId}`,
            {
              couponCode: selectedCouponCode,
            }
          );
          
          if (response.data.message === "success") {
             
            const bookingData = response.data.updateData
            
            dispatch(setPendingBooking(bookingData))
            setTotalPrice(bookingData.totalUpdatePrice)
              }

        } catch (error) {
          console.error('Lỗi áp dụng coupon:', error);
        }

}



const formatDiscount = (coupon) => {
  if (coupon.discountType === 'percent') {
    // Lấy phần nguyên của giá trị
    const percentValue = Math.floor(parseFloat(coupon.discountValue));
    return `Giảm ${percentValue}%`;
  }
  if (coupon.discountType === 'fixed') {
    const fixedValue = parseFloat(coupon.discountValue);
    // Format tiền tệ kiểu Việt Nam
    return `Giảm ${new Intl.NumberFormat('vi-VN').format(fixedValue)}đ`;
  }
  return coupon.code; // Fallback
};
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
   
         name: pendingBooking.hotelName, // <-- Bro nói text cứng (Tên riêng, giữ nguyên)
   
         checkIn: formatDate(pendingBooking.checkinDate),
   
         checkOut: formatDate(pendingBooking.checkoutDate),
   
         nights: nights,
   
         roomType:  pendingBooking.roomName,
   
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
   

  const handlePayment = async (paymentMethod: string) => {
     const response = await api.get(`payment-gate/${paymentMethod}`, {
       params: {
         orderAmount: Number(totalPrice),
         orderCode:pendingBooking?.bookingId.toString()
       }
     })
     window.location.href = response.data
   }
   
  
   
  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Header */}
      

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
                    onSelect={() => {
                      setTotalPrice(pendingBooking?.totalPrice)
                      setSelectedPayment(method.id)
                    }
                    }
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
      <span>
        {selectedCouponId
          ? 'Đã chọn 1 mã'
          : 'Áp dụng Mã giảm giá'}
      </span>
    </div>
    <span className="text-sky-600">
      {showCoupon ? 'Đóng' : 'Áp dụng'}
    </span>
  </button>

  {/* Phần nội dung được xổ xuống */}
  {showCoupon && (
    <div className="mt-4 space-y-3">
      {/* 1. Ô input đã được thêm onFocus */}
     <div className="flex gap-2">
    <input
        type="text"
        placeholder="Nhập mã giảm giá khác"
        // --- THAY ĐỔI 2: Thay 'w-full' bằng 'flex-1' ---
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        onChange={(e) => setSelectedCouponeCode(e.target.value)}
    />
    
    {/* --- THAY ĐỔI 3: Thêm nút "Áp dụng" --- */}
    <button
        type="button"
        onClick={handleCouponCode}
        className="px-4 py-2 text-white bg-sky-500 rounded-lg hover:bg-sky-600"
    >
        Áp dụng
    </button>
    {/* ------------------------------------- */}
</div>

                    {couponData ? (
                       <div className="relative text-center">
        <hr className="border-gray-200" />
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-sm text-gray-500">
          HOẶC
        </span>
      </div>
     ):null}

      {/* 2. Hiển thị loading, error hoặc danh sách coupon */}
      {couponIsLoading && (
        <p className="text-gray-500 text-center">Đang tải mã...</p>
      )}

      {couponError && (
        <p className="text-red-500 text-center">
          Không thể tải mã giảm giá.
        </p>
      )}

      {/* 3. Danh sách coupon */}
      {couponData && couponData.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {couponData.map((coupon) => (
            <label
              key={coupon.id}
              className={`flex items-center w-full p-3 border rounded-lg cursor-pointer transition-all ${
                selectedCouponId === coupon.id
                  ? 'border-sky-500 ring-2 ring-sky-200 bg-sky-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Nút chọn bên trái */}
              <input
                type="radio"
                name="coupon-selection"
                value={coupon.id}
                checked={selectedCouponId === coupon.id}
                // --- THAY ĐỔI 2: Cập nhật logic onChange ---
                onChange={() => {
                  setSelectedCouponId((prevId) =>
                    prevId === coupon.id ? null : coupon.id
                  )
                }
                }
                // ------------------------------------------
                className="h-5 w-5 text-sky-600 border-gray-300 focus:ring-sky-500"
              />

              {/* Hình (Icon) */}
              <div className="ml-3">
                <Ticket
                  size={24}
                  className={
                    coupon.discountType === 'percent'
                      ? 'text-green-500'
                      : 'text-orange-500'
                  }
                />
              </div>

              {/* Nội dung (flex-grow để đẩy code sang phải) */}
              <div className="ml-3 flex-grow flex items-center justify-between">
                {/* Mô tả giảm giá */}
                <span className="font-medium text-gray-800">
                  {formatDiscount(coupon)}
                </span>

                {/* Logo payment bên phải */}
                <div className="w-10 h-6 rounded flex items-center justify-center overflow-hidden bg-white">
                  <img
                    src={`/coupon/${selectedPayment}.png`}
                    alt={`${selectedPayment} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Trường hợp không có coupon nào */}
      {couponData && couponData.length === 0 && !couponIsLoading && (
        <p className="text-gray-500 text-center">
          Không có mã giảm giá nào.
        </p>
      )}
    </div>
  )}
</div>

  

              {/* Total Price (Đã dịch) */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">Tổng tiền</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(Number(totalPrice))}</span>
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