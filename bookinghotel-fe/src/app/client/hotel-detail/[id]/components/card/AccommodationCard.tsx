// components/cards/AccommodationCard.tsx

import { Star, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback'; // Dùng lại component của bro

// Định nghĩa kiểu dữ liệu cho 1 khách sạn
export interface Accommodation {
  id: string;
  imageUrl: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  originalPrice: number;
  discountedPrice: number;
}

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  return (
    // Set width cố định để nó scroll ngang
    <div className="flex-shrink-0 w-64 bg-white shadow rounded-lg overflow-hidden">
      <div className="h-40 relative">
        <ImageWithFallback
          src={accommodation.imageUrl}
          alt={accommodation.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3">
        <h3 className="font-bold text-gray-800 truncate" title={accommodation.name}>
          {accommodation.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 text-sm mt-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium text-gray-700">
            {accommodation.rating.toFixed(1)}
          </span>
          <span className="text-gray-500">
            / 10 ({accommodation.reviewCount})
          </span>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin className="w-4 h-4" />
          <span>{accommodation.location}</span>
        </div>
        
        {/* Prices */}
        <div className="mt-3 text-right">
          <span className="text-sm text-gray-500 line-through">
            {accommodation.originalPrice.toLocaleString('vi-VN')} VND
          </span>
          <p className="text-lg font-bold text-orange-600">
            {accommodation.discountedPrice.toLocaleString('vi-VN')} VND
          </p>
          <span className="text-xs text-gray-500">
            Exclude taxes & fees
          </span>
        </div>
      </div>
    </div>
  );
}