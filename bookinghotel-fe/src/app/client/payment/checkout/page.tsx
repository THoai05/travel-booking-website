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
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'vnpay',
      name: 'VNPay',
      badge: 'Enjoy Discount!',
      icons: ['VietQR'],
    },
    {
      id: 'momo',
      name: 'Momo',
      badge: 'Easy payment steps and faster verification',
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
   
         name: "Pariat River Front Hotel Da Nang", // <-- Bro nói text cứng
   
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
                  <span>Secure Payment</span>
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

              {/* VietQR Instructions */}
              {selectedPayment === 'vietqr' && (
                <div className="mt-4 bg-sky-50 border border-sky-200 rounded-lg p-4">
                  <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                    <li>Make sure you have any e-wallet or mobile banking app that supports payment with VietQR.</li>
                    <li>A QR code will appear after you click the 'Pay' button. Simply save or screenshot the QR code to complete your payment within the time limit.</li>
                    <li>Please use the latest QR code provided to complete your payment.</li>
                  </ul>
                </div>
              )}

              {/* Coupon Section */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="flex items-center justify-between w-full text-sky-600 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Info size={18} />
                    <span>Apply Coupons</span>
                  </div>
                  <span className="text-sky-600">Apply</span>
                </button>
                {showCoupon && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Enter coupon code or select available coupon(s)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Points Section */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={18} className="text-yellow-600" />
                  <span className="font-semibold text-gray-800">Redeem Bluvera Points</span>
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
              <p className="text-sm text-gray-600 mt-1 ml-7">Your Points: 300</p>

              {/* Total Price */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">Total Price</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">414.686 VND</span>
                    <ChevronDown size={20} className="text-gray-600" />
                  </div>
                </div>

                <button onClick={()=>handlePayment(selectedPayment)} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors">
                  Pay & Show QR Code
                </button>

                <p className="text-xs text-center text-gray-600 mt-3">
                  Bạn đang đồng ý với{' '}
                  <a href="#" className="text-sky-600 underline">Chính sách và điều kiện của Bluvera</a>{' '}
                  and <a href="#" className="text-sky-600 underline">Privacy Policy</a>.
                </p>
              </div>

              {/* Rewards */}
              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-600">
                  <Info size={16} />
                  <span>Cộng thêm 1,336 điểm Bluevera</span>
                </div>
                <div className="flex items-center gap-1 text-sky-600">
                  <Info size={16} />
                  <span>Earn 497,623 Priority Stars</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hotel Summary */}
          <div className="lg:col-span-1">
            <HotelSummaryCard hotel={hotelDetailsProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelokaPaymentPage;