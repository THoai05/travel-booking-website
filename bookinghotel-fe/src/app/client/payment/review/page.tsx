'use client'

import React, { useState } from 'react';
import { 
  Mail, User, Star, Users, Bed, Calendar, Info, ChevronDown,
  Wifi, Shield, AlertCircle, Tag, CheckCircle2,MapPin,Coffee,Phone
} from 'lucide-react';

import HotelSummaryCard from './components/HotelSummaryCard';
import PriceDetailsSection from './components/PriceDetailSection';

// Types
interface BookingForm {
  fullName: string;
  mobileNumber: string;
  countryCode: string;
  email: string;
  bookingForMyself: boolean;
}

interface GuestForm {
  fullName: string;
}

interface SpecialRequest {
  id: string;
  label: string;
  checked: boolean;
}



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

// Components
const InputField: React.FC<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  helper?: string;
}> = ({ label, placeholder, value, onChange, required, type = 'text', helper }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}{required && '*'}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
    />
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
  </div>
);

const PhoneInput: React.FC<{
  countryCode: string;
  phoneNumber: string;
  onCountryChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
}> = ({ countryCode, phoneNumber, onCountryChange, onPhoneChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Mobile Number*
    </label>
    <div className="flex gap-2">
      <div className="w-32">
        <div className="flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-lg bg-white">
          <span className="text-xl">🇻🇳</span>
          <span className="font-semibold">+84</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => onPhoneChange(e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
      />
    </div>
    <p className="text-xs text-gray-500 mt-1">
      e.g. +(62)812345678, for Country Code (+62) and Mobile No. 0812345678
    </p>
  </div>
);

const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 text-sky-600 rounded border-gray-300 focus:ring-2 focus:ring-sky-500"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

const Section: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  children: React.ReactNode;
  className?: string;
}> = ({ icon, title, children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="text-gray-700">{icon}</div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);





// Main Component
const TravelokaBookingPage: React.FC = () => {
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    fullName: '',
    mobileNumber: '',
    countryCode: '+84',
    email: '',
    bookingForMyself: false,
  });

  const [guestForm, setGuestForm] = useState<GuestForm>({
    fullName: '',
  });

  const [specialRequests, setSpecialRequests] = useState<SpecialRequest[]>([
    { id: 'non-smoking', label: 'Non-smoking Room', checked: false },
    { id: 'connecting', label: 'Connecting Rooms', checked: false },
    { id: 'high-floor', label: 'High Floor', checked: false },
  ]);



  const toggleRequest = (id: string) => {
    setSpecialRequests(requests =>
      requests.map(req => req.id === id ? { ...req, checked: !req.checked } : req)
    );
  };

  const updateBookingForm = (field: keyof BookingForm, value: string | boolean) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b mt-15">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sky-600 font-bold text-2xl">Bluevera</div>
              <div className="w-6 h-6 bg-sky-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <span className="text-sky-600 font-semibold">Review</span>
              </div>
              <div className="text-gray-300">—</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="text-gray-500">Pay</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hotel Info Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">Pariat River Front Hotel Da Nang</h1>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3].map((i) => (
              <Star key={i} size={14} fill="#FCD34D" className="text-yellow-400" />
            ))}
            <span className="text-sm text-gray-600 ml-1">7.9 (360)</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Logged in Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-gray-700">
            Logged in as <span className="font-semibold">C&ocirc;ng Hậu H&agrave; (Google)</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Contact */}
            <Section icon={<Mail size={20} />} title="Booking contact">
              <p className="text-sm text-gray-600 mb-4">
                Please fill in all fields correctly to receive your booking confirmation.
              </p>

              <InputField
                label="Full Name"
                placeholder=""
                value={bookingForm.fullName}
                onChange={(v) => updateBookingForm('fullName', v)}
                required
                helper="Vietnamese users: enter Middle Name + First Name + Last Name. Others: First Name + Last Name."
              />

              <div className="grid md:grid-cols-2 gap-4">
                <PhoneInput
                  countryCode={bookingForm.countryCode}
                  phoneNumber={bookingForm.mobileNumber}
                  onCountryChange={(v) => updateBookingForm('countryCode', v)}
                  onPhoneChange={(v) => updateBookingForm('mobileNumber', v)}
                />

                <InputField
                  label="Email"
                  type="email"
                  placeholder="e.g. email@example.com"
                  value={bookingForm.email}
                  onChange={(v) => updateBookingForm('email', v)}
                  required
                />
              </div>

              <div className="mt-4">
                <Checkbox
                  checked={bookingForm.bookingForMyself}
                  onChange={(v) => updateBookingForm('bookingForMyself', v)}
                  label="I'm booking for myself"
                />
              </div>
            </Section>

            {/* Guest Detail */}
            <Section icon={<User size={20} />} title="Guest Detail">
              <p className="text-sm text-gray-600 mb-4">
                Fill in all columns correctly to receive order confirmation
              </p>

              <InputField
                label="Full Name"
                placeholder=""
                value={guestForm.fullName}
                onChange={(v) => setGuestForm({ fullName: v })}
                required
                helper="Vietnamese users: enter Middle Name + First Name + Last Name. Others: First Name + Last Name."
              />
            </Section>

            {/* Special Request */}
            <Section icon={<AlertCircle size={20} />} title="Special Request">
              <p className="text-sm text-gray-600 mb-4">
                All special requests are subject to availability and thus are not guaranteed. Early check-in or Airport Transfer may incur additional charges. Please contact hotel staff directly for further information.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {specialRequests.map(request => (
                  <Checkbox
                    key={request.id}
                    checked={request.checked}
                    onChange={() => toggleRequest(request.id)}
                    label={request.label}
                  />
                ))}
              </div>

              <button className="text-sky-600 hover:text-sky-700 font-semibold mt-3 text-sm">
                Read All
              </button>
            </Section>

            
          </div>

          {/* Right Column - Room Summary */}
          <div className="lg:col-span-1">
            <HotelSummaryCard hotel={hotelDetails} guest={guestDetails} />          
            <PriceDetailsSection/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelokaBookingPage;