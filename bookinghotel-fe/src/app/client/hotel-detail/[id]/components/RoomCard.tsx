'use client';
import { useMemo,useState } from 'react';
import { Room, RoomOption } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Maximize2,
  Users,
  Bed,
  Wifi,
  WifiOff,
  ShowerHead,
  Snowflake,
  Check,
  CreditCard,
  Info,
} from 'lucide-react';
import { Badge } from './ui/badge';
import api from '../../../../../axios/axios';
import { useAppDispatch, useAppSelector } from '@/reduxTK/hook';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { setPendingBooking } from '@/reduxTK/features/bookingSlice'
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Login from "@/app/auth/login/page";
import Register from "@/app/auth/register/page";
import toast from 'react-hot-toast';



// --- Helper Functions ---
const getAmenityIcon = (amenity: string | undefined, size = 'w-4 h-4') => {
  const iconMap: Record<string, any> = {
    'Free WiFi': Wifi,
    Shower: ShowerHead,
    'Air conditioning': Snowflake,
    'Hot water': ShowerHead,
  };
  const Icon = amenity ? iconMap[amenity] || Info : Info;
  return <Icon className={`${size} text-gray-500`} />;
};

interface RoomCardProps {
  room?: Room; // có thể undefined
}

export default function RoomCard({ room }: RoomCardProps) {
  const safeRoom = room ?? {
    id: 'unknown',
    name: 'Unknown Room',
    image: '/placeholder-room.jpg',
    size: 0,
    hasWifi: false,
    amenities: [],
    ratePlans: [],
  };

  /////////=====================////////

  const [showLogin, setShowLogin] = useState(false);
   
  const [showRegister, setShowRegister] = useState(false);
  

   
  

   const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    localStorage.setItem("methodShowLoginregister", JSON.stringify("showLogin"));
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    localStorage.setItem("methodShowLoginregister", JSON.stringify("showRegister"));
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
    localStorage.setItem("methodShowLoginregister", JSON.stringify("none"));
  };

  const handleClick = () => {
  if (!user) {
    openLogin(); // hoặc showLogin = true
    return;
  }

  handleCreateBooking(
    checkIn,
    checkOut,
    totalGuests,
    Number(option?.salePrice) * nights,
    user?.id,
    room?.id,
    option?.id
  );
};

  /////////=====================////////

  const roomTypeName = new Map([
    ['deluxe double', "Phòng đôi sang trọng",],
    ['deluxe_family', "Phòng gia đình sang trọng",],
    ['grand family', "Phòng đại gia đình",],
    ['deluxe triple', "Phòng ba sang trọng",],
    ['standard', "Phòng tiêu chuẩn",],
    ['double room', "Phòng đôi tiêu chuẩn ",],
    ['triple room', "Phòng ba tiêu chuẩn",],
    
  ])

  const paymentPolicyName = new Map([
    ['FREE_CANCELLATION','Hoàn trả phòng miễn phí'],
    ['NON_REFUNDABLE','Không cho phép hoàn trả'],
    ['PAY_AT_HOTEL','Hỗ trợ thanh toán tại khách sạn'],
  ])

  const safeRatePlans = Array.isArray(safeRoom.ratePlans)
    ? safeRoom.ratePlans
    : [];

  const safeAmenities = Array.isArray(safeRoom.amenities)
    ? safeRoom.amenities.slice(0, 2)
    : [];

  const dispatch = useAppDispatch()
  const { 
    destination,
    checkIn,
    checkOut,
    guests
  } = useAppSelector((state) => state.search)

  
  const { adults, children } = guests
  const { nights, } = useMemo(() => {
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
  const totalGuests =  Number( adults + children )
  
  const { user } = useAuth()
const router = useRouter()

  const handleCreateBooking = async (
    checkinDate,
    checkoutDate,
    guestsCount,
    totalPrice,
    userId,
    roomTypeId,
    ratePlanId
  )=> {
    try {
      const response = await api.post('bookings', {
      checkinDate,
      checkoutDate,
      guestsCount,
      totalPrice,
      userId,
      roomTypeId,
      ratePlanId
    })
    if (response.data.message === "success") {
      const bookingData = response.data.data
      dispatch(setPendingBooking(bookingData))

      // 2. LƯU VÀO SESSION (Chỉ ID)
      sessionStorage.setItem('activeBookingId', bookingData.bookingId.toString())

      // 3. Chuyển trang
      router.push('/payment/review')
    }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <Card className="overflow-hidden shadow-sm border-gray-200">
      {/* Room Name Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          {roomTypeName.get(safeRoom.name) || 'Phòng tiêu chuẩn'}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Image + Amenities */}
          <div className="lg:col-span-3 space-y-4">
          <div className="relative rounded-lg overflow-hidden group">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
              className="group rounded-lg overflow-hidden"
              // --- BẮT ĐẦU THÊM VÀO ---
              style={{
                '--swiper-navigation-color': '#fff', // 1. Đổi màu mũi tên sang trắng
                '--swiper-navigation-size': '25px', // 2. Đổi size (mặc định là 44px)
              }}
              // --- KẾT THÚC ---
            >
              {safeRoom.images.map((image) => (
                <SwiperSlide key={image.url}>
                  <ImageWithFallback
                    src={image?.url || '/placeholder-room.jpg'}
                    alt={roomTypeName.get(safeRoom.name) || 'Room Image'}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                <span>{safeRoom.area || 0}</span>
              </div>

              <div className="flex items-center gap-2">
                {safeRoom.hasWifi ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Free WiFi</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>WiFi miễn phí</span>
                  </>
                )}
              </div>

              {safeAmenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  {getAmenityIcon(amenity)}
                  <span>{amenity || 'Unknown amenity'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Room Options Table */}
          <div className="lg:col-span-9">
            <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 border-b text-sm text-gray-700 mb-4">
              <div className="col-span-6">Tùy chọn phòng</div>
              <div className="col-span-2">Số khách</div>
              <div className="col-span-4 text-right">Giá mỗi đêm</div>
            </div>

            <div className="space-y-4">
              {safeRatePlans.length > 0 ? (
                safeRatePlans.map((option, index) => (
                  <div
                    key={option?.id || index}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 ${
                      index !== safeRatePlans.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    {/* Column 1: Room Option Details */}
                    <div className="col-span-1 md:col-span-6 space-y-2">
                      <p className="text-gray-600">
                        {option?.name || 'Standard Option'}
                      </p>
                      <p className="text-sm text-gray-800 font-bold">
                        {option?.includes || 'Phục vụ bữa sáng miễn phí'}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Bed className="w-4 h-4" />
                        <span>{safeRoom?.bedType || '1 double bed'}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm font-bold text-green-700">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {paymentPolicyName.get(option?.cancellationPolicy) ||
                            'No cancellation policy info'}
                        </span>
                        {(option?.cancellationPolicy || '').includes(
                          'Free Cancellation'
                        ) && (
                          <Info className="w-4 h-4 text-green-700 cursor-pointer" />
                        )}
                      </div>

                      {option?.paymentInfo && (
                        <div className="flex items-start gap-2 text-sm">
                          <CreditCard className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                          <span className="text-sky-700">
                            {option.paymentInfo}{' '}
                            <span className="text-gray-500">or pay now</span>
                          </span>
                          <Info className="w-4 h-4 text-sky-700 cursor-pointer" />
                        </div>
                      )}
                    </div>

                    {/* Column 2: Guests */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {safeRoom.maxGuests ?? 2}
                        </span>
                        <Users className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>

                    {/* Column 3: Price & Action */}
                    <div className="col-span-1 md:col-span-4 flex flex-col items-start md:items-end gap-2">
                      {option?.specialTag && (
                        <Badge
                          variant="secondary"
                          className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                        >
                          {option.specialTag}
                        </Badge>
                      )}

                      {option?.originalPrice &&
                        option?.salePrice &&
                        option.originalPrice > option.salePrice && (
                          <p className="text-sm text-gray-400 line-through">
                            {Number(option.originalPrice).toLocaleString('vi-VN')} VND
                          </p>
                        )}

                      <p className="text-orange-600 text-xl">
                        {Number(option?.salePrice || 0).toLocaleString('vi-VN')} VND
                      </p>

                      <p className="text-xs text-gray-500">
                        Chưa bao gồm thuế và phí
                      </p>

                     <Button
                        onClick={() => {
                          if (!user) {
                              openLogin(); // hoặc showLogin = true
                              return;
                            }
                            handleCreateBooking(
                              checkIn,
                              checkOut,
                              totalGuests,
                              Number(option?.salePrice) * nights,
                              user?.id,
                              room?.id,
                              option?.id
                            );
                        }}
                        className="w-full md:w-24 bg-sky-500 hover:bg-sky-700 text-white mt-2"
                      >
                        Chọn phòng
                      </Button>

                        {showLogin && (
                          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
                            <Login onClose={closeModal} onSwitchToRegister={openRegister} />
                          </div>
                        )}

                        {showRegister && (
                          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
                            <Register onClose={closeModal} onSwitchToLogin={openLogin} />
                          </div>
                        )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không còn tùy chọn phòng cho khách sạn 
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
