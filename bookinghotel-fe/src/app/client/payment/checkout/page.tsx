'use client'
import React, { useState, useEffect } from 'react';
import { Clock, Info, Wifi, Users, Bed, Coffee, MapPin, Phone, Mail, CheckCircle2, ChevronDown } from 'lucide-react';

// Types
interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  badge?: string;
  icons?: string[];
  disabled?: boolean;
}

interface HotelDetails {
  bookingId: string;
  name: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  guests: number;
  bedType: string;
  breakfast: boolean;
  wifi: boolean;
}

interface GuestDetails {
  name: string;
  phone: string;
  email: string;
  nonRefundable: boolean;
  nonReschedulable: boolean;
}

// Components
const CountdownTimer: React.FC<{ seconds: number }> = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <span className="text-yellow-300 font-semibold">
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  );
};

const PaymentMethodOption: React.FC<{
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}> = ({ method, selected, onSelect }) => (
  <div
    onClick={!method.disabled ? onSelect : undefined}
    className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all ${
      selected ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300'
    } ${method.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-sky-500' : 'border-gray-300'
        }`}>
          {selected && <div className="w-3 h-3 rounded-full bg-sky-500" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{method.name}</span>
          </div>
          {method.description && (
            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
          )}
        </div>
      </div>
      {method.icons && method.icons.length > 0 && (
        <div className="flex gap-2">
          {method.icons.map((icon, idx) => (
            <div key={idx} className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-semibold text-gray-600">
              {icon}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const HotelSummaryCard: React.FC<{ hotel: HotelDetails; guest: GuestDetails }> = ({ hotel, guest }) => (
  <div className="bg-sky-50 rounded-lg p-5">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white">
        <MapPin size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-sm">Hotel Summary</h3>
        <p className="text-xs text-gray-600">Booking ID: {hotel.bookingId}</p>
      </div>
    </div>

    <h2 className="font-bold text-gray-900 mb-4">{hotel.name}</h2>

    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
      <div>
        <p className="text-xs text-gray-600">Check-in</p>
        <p className="font-semibold text-sm">{hotel.checkIn}</p>
        <p className="text-xs text-gray-500">From 14:00</p>
      </div>
      <div>
        <p className="text-xs text-gray-600">{hotel.nights} night</p>
        <div className="my-1">→</div>
      </div>
      <div>
        <p className="text-xs text-gray-600">Check-out</p>
        <p className="font-semibold text-sm">{hotel.checkOut}</p>
        <p className="text-xs text-gray-500">Before 12:00</p>
      </div>
    </div>

    <div className="border-t pt-4 space-y-3">
      <p className="font-semibold text-sm">{hotel.roomType}</p>
      
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Users size={16} />
        <span>{hotel.guests} Guests</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Bed size={16} />
        <span>{hotel.bedType}</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Coffee size={16} />
        <span>{hotel.breakfast ? 'Breakfast included' : 'Breakfast not included'}</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Wifi size={16} />
        <span>Free WiFi</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t">
      <p className="text-sm font-semibold mb-2">Guest(s)</p>
      <p className="text-sm text-gray-700">{guest.name}</p>
      <div className="flex gap-2 mt-2">
        <span className="text-xs flex items-center gap-1">
          <CheckCircle2 size={14} className="text-gray-500" />
          Non-refundable
        </span>
        <span className="text-xs flex items-center gap-1">
          <CheckCircle2 size={14} className="text-gray-500" />
          Non-reschedulable
        </span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t">
      <p className="text-sm font-semibold mb-2">Contact Details</p>
      <p className="text-sm text-gray-700 flex items-center gap-2">
        <Users size={14} />
        {guest.name}
      </p>
      <p className="text-sm text-gray-700 flex items-center gap-2">
        <Phone size={14} />
        {guest.phone}
      </p>
      <p className="text-sm text-gray-600 flex items-center gap-2 break-all">
        <Mail size={14} />
        {guest.email}
      </p>
    </div>
  </div>
);

// Main Component
 const TravelokaPaymentPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState('vietqr');
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

  const hotelDetails: HotelDetails = {
    bookingId: '1296078565',
    name: 'Pariat River Front Hotel Da Nang',
    checkIn: 'Tue, 28 October 2025',
    checkOut: 'Wed, 29 October 2025',
    nights: 1,
    roomType: '(1x) Standard Room - Room Only',
    guests: 2,
    bedType: '1 double bed',
    breakfast: false,
    wifi: true,
  };

  const guestDetails: GuestDetails = {
    name: 'Lo Thanh Ha',
    phone: '+84812373122',
    email: 'naconghau06@gmail.com',
    nonRefundable: true,
    nonReschedulable: true,
  };

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

                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors">
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
            <HotelSummaryCard hotel={hotelDetails} guest={guestDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelokaPaymentPage;