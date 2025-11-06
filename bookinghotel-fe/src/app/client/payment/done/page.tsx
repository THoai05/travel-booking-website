'use client'

import { CheckCircle, Download, Calendar, Mail, Phone, MapPin, Clock, Users, Wifi, Coffee, Car, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from './components/ui/separator';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useAppSelector,useAppDispatch } from '@/reduxTK/hook';
import { selectBooking } from "@/reduxTK/features/bookingSlice";


const PaymentDone = () => {
    const { pendingBooking } = useAppSelector(selectBooking)
    console.log(pendingBooking)

    // 1. Xử lý state rỗng hoặc đang tải
    if (!pendingBooking) {
      return (
        <div className="min-h-screen bg-secondary/30 mt-10 flex items-center justify-center">
          <p className="text-lg">Đang tải chi tiết đặt phòng...</p>
        </div>
      );
    }

    // 2. Chuyển đổi và tạo dữ liệu cần thiết từ pendingBooking
    
    // Đảm bảo parse ngày theo múi giờ UTC để tránh lỗi lệch ngày
    const checkInDate = new Date(pendingBooking.checkinDate + 'T00:00:00Z');
    const checkOutDate = new Date(pendingBooking.checkoutDate + 'T00:00:00Z');

    // Tính số đêm
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Định dạng ngày đầy đủ
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Quan trọng: chỉ định timezone khi định dạng
    };
    const checkInFull = checkInDate.toLocaleDateString('en-US', dateOptions);
    const checkOutFull = checkOutDate.toLocaleDateString('en-US', dateOptions);

    // Tạo mã tham chiếu
    const confirmationNumber = `BK-${pendingBooking.bookingId}`;

    // Xử lý tên khách (ưu tiên guestsFullName, nếu không có thì dùng contactFullName)
    const guestName = pendingBooking.guestsFullName || pendingBooking.contactFullName || 'Guest';

    // Xử lý tổng tiền (đề phòng trường hợp nó là string từ JSON)
    const totalAmount = typeof pendingBooking.totalPrice === 'string' 
      ? parseFloat(pendingBooking.totalPrice) 
      : pendingBooking.totalPrice;

    // Định dạng tiền tệ (Giả định là VND dựa trên số lớn)
    const formattedTotal = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(totalAmount);


  return (
    <div className="min-h-screen bg-secondary/30  mt-10">
      {/* Header */}
    

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <div className="bg-success/10 border border-success/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-success-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">Booking confirmed!</h2>
              <p className="text-muted-foreground mb-4">
                Your reservation is confirmed. We've sent the details to {pendingBooking.contactEmail}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download confirmation
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to calendar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Card */}
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYyMjUyOTg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt={pendingBooking.roomName}
                    className="w-full h-full object-cover min-h-[200px]"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{pendingBooking.hotelName}</h3>
                      <p className="text-muted-foreground text-sm">{pendingBooking.roomName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{pendingBooking.hotelAddress}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = `tel:${pendingBooking.hotelPhone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    {/* Đã loại bỏ nút Email vì không có dữ liệu hotelEmail */}
                  </div>
                </div>
              </div>
            </Card>

            {/* Check-in/out Details */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Your reservation</h3>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-2">CHECK-IN</div>
                  <div className="font-semibold text-foreground">{checkInFull}</div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    <span>After 3:00 PM</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-2">CHECK-OUT</div>
                  <div className="font-semibold text-foreground">{checkOutFull}</div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    <span>Before 11:00 AM</span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total length of stay:</span>
                <span className="font-semibold">{nights} nights</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Guests:</span>
                <span className="font-semibold">{pendingBooking.guestsCount} adults</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Bed Type:</span>
                <span className="font-semibold">{pendingBooking.bedType}</span>
              </div>
            </Card>

            {/* Amenities */}
            

            {/* Guest Information */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Guest details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-semibold">{guestName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-semibold">{pendingBooking.contactEmail}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-semibold">{pendingBooking.contactPhone}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Booking Reference */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Booking reference</h3>
              <div className="text-center py-4 bg-secondary rounded-lg">
                <div className="text-3xl font-mono font-bold text-primary tracking-wider">
                  {confirmationNumber}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Save this number for your records
              </p>
            </Card>

            {/* Price Summary */}
            <Card className="p-6  top-24">
              <h3 className="font-bold text-lg mb-4">Price summary</h3>
              <div className="space-y-3 mb-4">
                {/* Đã loại bỏ phần breakdown (giá phòng x số đêm, thuế) 
                  vì 'pendingBooking' chỉ cung cấp 'totalPrice'
                */}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Total (VND)</span>
                <span className="text-2xl font-bold">{formattedTotal}</span>
              </div>
              <div className="mt-4 p-3 bg-success/10 rounded-lg flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold">
                  {pendingBooking.status === 'confirmed' ? 'Paid in full' : 'Confirmed'}
                </span>
              </div>
            </Card>

            {/* Need Help */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-3">Need help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Questions about your booking? Contact us anytime.
              </p>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Contact support
              </Button>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
       
      </main>
    </div>
  );
};

export default PaymentDone;