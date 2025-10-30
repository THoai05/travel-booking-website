'use client'

import React, { useState } from 'react';
import { 
  Mail, User, Star, Users, Bed, Calendar, Info, ChevronDown,
  Wifi, Shield, AlertCircle, Tag, CheckCircle2,MapPin,Coffee,Phone
} from 'lucide-react';



interface PriceDetailsProps {
  roomPrice: string;
  taxes: string;
  total: string;
  oldTotal?: string;
  nights?: number;
  rooms?: number;
}


const PriceDetailsSection: React.FC<PriceDetailsProps> = ({
  roomPrice,
  taxes,
  total,
  oldTotal,
  nights = 1,
  rooms = 1,
}) => {
  const [showPriceDetails, setShowPriceDetails] = useState(false);

    return (
      <div className="bg-white rounded-lg shadow-sm p-5 sticky top-4 mt-10">
    <div className="border-t pt-4">
        <button
          onClick={() => setShowPriceDetails(!showPriceDetails)}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-gray-600" />
            <span className="font-bold text-gray-900">Price details</span>
          </div>
          <ChevronDown size={20} className={`transition-transform ${showPriceDetails ? 'rotate-180' : ''}`} />
        </button>

        {showPriceDetails && (
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Room Price</span>
              <span className="font-semibold text-gray-900">359.036 VND</span>
            </div>
            <div className="text-xs text-gray-500">
              (1x) Standard Room - Room Only (1 Night)
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Taxes and Fees</span>
              <span className="font-semibold text-gray-900">55.650 VND</span>
            </div>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-gray-400 line-through text-sm">432.363 VND</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">1 room(s), 1 night</span>
            <span className="text-xl font-bold text-red-500">414.686 VND</span>
          </div>
        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors mb-3">
          Continue
        </button>

        <p className="text-xs text-center text-gray-600">
          By continuing to payment, you have agreed to Traveloka's{' '}
          <a href="#" className="text-blue-600 underline">Terms & Conditions</a>,{' '}
          <a href="#" className="text-blue-600 underline">Privacy Policy</a>, and{' '}
          <a href="#" className="text-blue-600 underline">Accommodation Refund Procedure</a>
        </p>
      </div>
      <div className="mt-4 pt-4 border-t space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <Star size={12} fill="white" className="text-white" />
          </div>
          <span className="text-gray-700">Earn 1,451 Points</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <Star size={12} fill="white" className="text-white" />
          </div>
          <span className="text-gray-700">Earn 497,623 Priority Stars</span>
        </div>
      </div>
    </div>
  );
};

export default PriceDetailsSection