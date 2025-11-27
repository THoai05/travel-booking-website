'use client'

import { useEffect } from 'react';
import { CheckCircle, Download, Calendar, Mail, Phone, MapPin, Clock, Users, Sparkles, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from './components/ui/separator';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useAppSelector,useAppDispatch } from '@/reduxTK/hook';
import { fetchBookingById } from '@/reduxTK/features/bookingSlice';
import { selectBooking } from "@/reduxTK/features/bookingSlice";

const ROOM_TYPE_NAMES = new Map([
  ['deluxe double', "Phòng đôi sang trọng"],
  ['deluxe family', "Phòng gia đình sang trọng"],
  ['grand family', "Phòng đại gia đình"],
  ['deluxe triple', "Phòng ba sang trọng"],
  ['standard', "Phòng tiêu chuẩn"],
  ['double room', "Phòng đôi tiêu chuẩn"],
  ['triple room', "Phòng ba tiêu chuẩn"],
]);

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC'
};

const PaymentDone = () => {

    const dispatch = useAppDispatch();
    useEffect(() => {
        const bookingIdStr = sessionStorage.getItem("activeBookingId");
        if (bookingIdStr) {
          const bookingId = Number(bookingIdStr);
          dispatch(fetchBookingById(bookingId));
        }
      }, [dispatch]);
  const { pendingBooking } = useAppSelector(selectBooking);

  if (!pendingBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-200 to-white flex items-center justify-center">
        <div className="text-center relative">
          <div className="absolute inset-0 blur-3xl bg-sky-300 opacity-30 animate-pulse"></div>
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-sky-900">Đang tải chi tiết đặt phòng...</p>
          </div>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(pendingBooking.checkinDate + 'T00:00:00Z');
  const checkOutDate = new Date(pendingBooking.checkoutDate + 'T00:00:00Z');
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const checkInFull = checkInDate.toLocaleDateString('vi-VN', DATE_FORMAT_OPTIONS);
  const checkOutFull = checkOutDate.toLocaleDateString('vi-VN', DATE_FORMAT_OPTIONS);
  
  const confirmationNumber = `BK-${pendingBooking.bookingId}`;
  const guestName = pendingBooking.guestsFullName || pendingBooking.contactFullName || 'Khách';
  const totalAmount = typeof pendingBooking.totalPrice === 'string' 
    ? parseFloat(pendingBooking.totalPrice) 
    : pendingBooking.totalPrice;
  
  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(totalAmount);

  const roomDisplayName = ROOM_TYPE_NAMES.get(pendingBooking.roomName) || pendingBooking.roomName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-100 to-white mt-10 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-300 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Success Banner with Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-3xl p-10 mb-10 shadow-2xl border border-sky-400/30">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50 animate-ping"></div>
                <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle className="w-11 h-11 text-sky-600" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-4xl font-black text-white">Đặt phòng thành công!</h2>
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-sky-50 text-lg mb-8 leading-relaxed">
                  Chúc mừng! Đặt phòng của bạn đã được xác nhận. Thông tin chi tiết đã được gửi đến <span className="font-semibold text-white">{pendingBooking.contactEmail}</span>
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-white text-sky-600 hover:bg-sky-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Gửi hóa đơn về Email
                  </Button>
                  <Button 
                    className="bg-sky-800 text-white hover:bg-sky-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold border-2 border-white/20"
                    size="lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Thêm vào lịch
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Property Card */}
            <Card className="overflow-hidden shadow-2xl border-0 hover:shadow-[0_20px_60px_rgba(14,165,233,0.3)] transition-all duration-500 group bg-white rounded-2xl">
              <div className="md:flex">
                <div className="md:w-2/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-transparent z-10"></div>
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYyMjUyOTg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt={roomDisplayName}
                    className="w-full h-full object-cover min-h-[250px] group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-20">
                    <Award className="w-4 h-4 inline mr-1" />
                    Premium
                  </div>
                </div>
                <div className="md:w-3/5 p-8 bg-gradient-to-br from-white to-sky-50/30">
                  <div className="mb-6">
                    <h3 className="text-3xl font-black text-sky-900 mb-3 leading-tight">{pendingBooking.hotelName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"></div>
                      <p className="text-sky-600 font-bold text-xl">{roomDisplayName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600 mb-8 p-4 bg-white rounded-xl shadow-sm">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-sky-500" />
                    <span className="text-sm leading-relaxed">{pendingBooking.hotelAddress}</span>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    size="lg"
                    onClick={() => window.location.href = `tel:${pendingBooking.hotelPhone}`}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Gọi điện ngay
                  </Button>
                </div>
              </div>
            </Card>

            {/* Check-in/out Details */}
            <Card className="p-10 shadow-2xl border-0 bg-white rounded-2xl hover:shadow-[0_20px_60px_rgba(14,165,233,0.2)] transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-3xl text-sky-900">Thông tin đặt phòng</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 to-sky-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-sky-200 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-300 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative">
                    <div className="text-xs font-black text-sky-600 mb-4 tracking-widest flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      NHẬN PHÒNG
                    </div>
                    <div className="font-black text-sky-900 text-xl mb-3 leading-tight">{checkInFull}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                      <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                      <span>Sau 15:00</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-blue-200 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative">
                    <div className="text-xs font-black text-blue-600 mb-4 tracking-widest flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      TRẢ PHÒNG
                    </div>
                    <div className="font-black text-blue-900 text-xl mb-3 leading-tight">{checkOutFull}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Trước 11:00</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent my-8"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-sky-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100">
                  <span className="text-gray-700 font-bold text-lg">Tổng thời gian lưu trú</span>
                  <span className="font-black text-sky-900 text-2xl">{nights} đêm</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-sky-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100">
                  <span className="text-gray-700 font-bold text-lg">Số khách</span>
                  <span className="font-black text-sky-900 text-xl">{pendingBooking.guestsCount} người lớn</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-sky-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100">
                  <span className="text-gray-700 font-bold text-lg">Loại giường</span>
                  <span className="font-black text-sky-900 text-xl">{pendingBooking.bedType}</span>
                </div>
              </div>
            </Card>

            {/* Guest Information */}
            <Card className="p-10 shadow-2xl border-0 bg-white rounded-2xl hover:shadow-[0_20px_60px_rgba(14,165,233,0.2)] transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-3xl text-sky-900">Thông tin khách</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center gap-5 p-6 bg-gradient-to-r from-sky-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-semibold tracking-wide">Họ tên</div>
                    <div className="font-black text-sky-900 text-xl">{guestName}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 p-6 bg-gradient-to-r from-sky-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-semibold tracking-wide">Email</div>
                    <div className="font-black text-sky-900 text-lg break-all">{pendingBooking.contactEmail}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 p-6 bg-gradient-to-r from-sky-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-sky-100 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-semibold tracking-wide">Số điện thoại</div>
                    <div className="font-black text-sky-900 text-xl">{pendingBooking.contactPhone}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-8">
            
            {/* Booking Reference */}
            <Card className="p-10 shadow-2xl border-0 bg-white rounded-2xl sticky top-24 hover:shadow-[0_20px_60px_rgba(14,165,233,0.3)] transition-all duration-500">
              <h3 className="font-black text-2xl text-sky-900 mb-8 text-center">Mã đặt phòng</h3>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative text-center py-10 bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 rounded-2xl border-4 border-sky-300 shadow-xl">
                  <div className="text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-blue-700 tracking-widest mb-2">
                    {confirmationNumber}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Shield className="w-5 h-5 text-sky-600" />
                    <span className="text-sm font-bold text-sky-700">Đã xác nhận</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-6 text-center leading-relaxed font-semibold">
                Lưu mã này để tra cứu và check-in khi cần
              </p>
            </Card>

            {/* Price Summary */}
            <Card className="p-10 shadow-2xl border-0 bg-white rounded-2xl hover:shadow-[0_20px_60px_rgba(14,165,233,0.3)] transition-all duration-500">
              <h3 className="font-black text-2xl text-sky-900 mb-8">Tổng chi phí</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent my-6"></div>
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-gray-700 text-xl">Tổng cộng</span>
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">{formattedTotal}</span>
              </div>
              <div className="relative overflow-hidden p-6 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-2xl flex items-center gap-4 text-white shadow-xl">
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                <CheckCircle className="w-8 h-8 flex-shrink-0 relative z-10" strokeWidth={2.5} />
                <span className="font-black text-lg relative z-10">
                  {pendingBooking.status === 'confirmed' ? 'Đã thanh toán đầy đủ' : 'Đã xác nhận'}
                </span>
              </div>
            </Card>

            {/* Need Help */}
            <Card className="p-10 shadow-2xl border-0 bg-gradient-to-br from-white to-sky-50/50 rounded-2xl hover:shadow-[0_20px_60px_rgba(14,165,233,0.3)] transition-all duration-500">
              <h3 className="font-black text-2xl text-sky-900 mb-6">Cần hỗ trợ?</h3>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Có câu hỏi về đặt phòng? Đội ngũ hỗ trợ 24/7 của chúng tôi luôn sẵn sàng giúp bạn.
              </p>
              <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 py-6 text-lg">
                <Mail className="w-5 h-5 mr-2" />
                Liên hệ hỗ trợ
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentDone;