'use client';
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
  console.log(room)
  const safeRoom = room ?? {
    id: 'unknown',
    name: 'Unknown Room',
    image: '/placeholder-room.jpg',
    size: 0,
    hasWifi: false,
    amenities: [],
    ratePlans: [],
  };

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
              <ImageWithFallback
                src={safeRoom.image || '/placeholder-room.jpg'}
                alt={roomTypeName.get(safeRoom.name) || 'Room Image'}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
              />
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
                    <span>Without WiFi</span>
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

                      <Button className="w-full md:w-24 bg-sky-500 hover:bg-sky-700 text-white mt-2">
                        Chọn phòng
                      </Button>
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
