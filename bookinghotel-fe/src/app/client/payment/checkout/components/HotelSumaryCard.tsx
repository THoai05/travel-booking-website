'use client'
import React, { useState, useEffect } from 'react';
import { Clock, Info, Wifi, Users, Bed, Coffee, MapPin, Phone, Mail, CheckCircle2, ChevronDown } from 'lucide-react';

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
export default HotelSummaryCard