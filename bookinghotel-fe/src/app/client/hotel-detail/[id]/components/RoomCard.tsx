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
const getAmenityIcon = (amenity: string, size = 'w-4 h-4') => {
  const iconMap: Record<string, any> = {
    'Free WiFi': Wifi,
    Shower: ShowerHead,
    'Air conditioning': Snowflake,
    'Hot water': ShowerHead,
  };
  const Icon = iconMap[amenity] || Info;
  return <Icon className={`${size} text-gray-500`} />;
};

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  // Sample room options - in a real app, this would come from props or API
  const roomOptions: RoomOption[] = [
    {
      id: 'best_offer_1',
      name: 'Best Available Rate',
      includes: 'Breakfast not Included',
      bedInfo: '1 double bed',
      cancellationPolicy: 'Free Cancellation until 02 Nov 12:59',
      paymentInfo: 'Log in to pay nothing until 02 Nov 2025',
      originalPrice: 353247,
      specialPrice: 264935,
      currency: 'VND',
      pax: 2,
      specialTag: 'Special for you!',
    },
    {
      id: 'best_offer_2',
      name: 'Best Available Rate',
      includes: 'Breakfast not Included',
      bedInfo: '1 double bed',
      cancellationPolicy: 'Pay at Hotel',
      paymentInfo: 'Pay when you check-in at the property',
      originalPrice: 353247,
      specialPrice: 264935,
      currency: 'VND',
      pax: 2,
      specialTag: 'Special for you!',
    },
    {
      id: 'best_offer_3',
      name: 'Best Available Rate',
      includes: 'Breakfast not Included',
      bedInfo: '1 double bed',
      cancellationPolicy: 'Free Cancellation until 04 Nov 12:59',
      paymentInfo: 'Log in to pay nothing until 03 Nov 2025',
      originalPrice: 1870129,
      specialPrice: 1402597,
      currency: 'VND',
      pax: 2,
    },
  ];

  return (
    <Card className="overflow-hidden shadow-sm border-gray-200">
      {/* Room Name Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 mb-3">{room.name}</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Image + Amenities */}
          <div className="lg:col-span-3 space-y-4">
            {/* Room Image */}
            <div className="relative rounded-lg overflow-hidden group">
              <ImageWithFallback
                src={room.image}
                alt={room.name}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Room Details */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                <span>{room.size} m²</span>
              </div>

              <div className="flex items-center gap-2">
                {room.hasWifi === false ? (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>Without WiFi</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Free WiFi</span>
                  </>
                )}
              </div>

              {room.amenities.slice(0, 2).map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Room Options Table */}
          <div className="lg:col-span-9">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 border-b text-sm text-gray-700 mb-4">
              <div className="col-span-6">Room Option(s)</div>
              <div className="col-span-2">Guest(s)</div>
              <div className="col-span-4 text-right">Price/room/night</div>
            </div>

            {/* Room Options */}
            <div className="space-y-4">
              {roomOptions.map((option, index) => (
                <div
                  key={option.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 ${
                    index !== roomOptions.length - 1 ? 'border-b' : ''
                  }`}
                >
                  {/* Column 1: Room Option Details */}
                  <div className="col-span-1 md:col-span-6 space-y-2">
                    <p className="text-gray-600">{option.name}</p>
                    <p className="text-sm text-gray-800 font-bold">{option.includes}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Bed className="w-4 h-4" />
                      <span>{option.bedInfo}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm font-bold text-green-700">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 font-bold"  />
                      <span>{option.cancellationPolicy}</span>
                      {option.cancellationPolicy.includes('Free Cancellation') && (
                        <Info className="w-4 h-4 text-green-700 cursor-pointer" />
                      )}
                    </div>

                    {option.paymentInfo && (
                      <div className="flex items-start gap-2 text-sm">
                        <CreditCard className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                        <span className="text-sky-700">{option.paymentInfo} <span className='text-gray-500'> or pay now</span></span>
                        <Info className="w-4 h-4 text-sky-700 cursor-pointer" />
                      </div>
                    )}

                    {option.cancellationPolicy === 'Pay at Hotel' && (
                      <div className="flex items-start gap-2 text-sm text-green-700">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Cancellation Policy Applies</span>
                        <Info className="w-4 h-4 text-blue-600 cursor-pointer" />
                      </div>
                    )}
                  </div>

                  {/* Column 2: Guests */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{option.pax}</span>
                      <Users className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>

                  {/* Column 3: Price & Action */}
                  <div className="col-span-1 md:col-span-4 flex flex-col items-start md:items-end gap-2">
                    {option.specialTag && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                      >
                        {option.specialTag}
                      </Badge>
                    )}

                    {option.originalPrice > option.specialPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        {option.originalPrice.toLocaleString('vi-VN')} {option.currency}
                      </p>
                    )}

                    <p className="text-orange-600 text-xl">
                      {option.specialPrice.toLocaleString('vi-VN')} {option.currency}
                    </p>

                    <p className="text-xs text-gray-500">Exclude taxes & fees</p>

                    <Button className="w-full md:w-24 bg-sky-500 hover:bg-sky-700 text-white mt-2">
                      Choose
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
