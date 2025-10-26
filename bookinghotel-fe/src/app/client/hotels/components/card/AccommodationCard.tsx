import { Star, MapPin, Phone } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho 1 khách sạn
export interface Accommodation {
  id: number;
  name: string;
  address: string;
  avgPrice: number;
  phone: string;
  city: {
    id: number;
    title: string;
  };
  avgRating: number;
  reviewCount: number;
  imageUrl?: string;
}

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  // Tính rating trên thang điểm 10
  const rating = Number((accommodation.avgRating * 2).toFixed(1));
  const router = useRouter()
  
  // Placeholder image nếu không có
  const defaultImage = "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYxMTg3NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <div onClick={()=>router.push(`hotel-detail/${accommodation.id}`)} className="flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={accommodation.imageUrl || defaultImage}
          alt={accommodation.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-900">{rating}</span>
            <span className="text-gray-500 text-sm">/10</span>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Hotel Name */}
        <h3 
          className="text-gray-900 mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors" 
          title={accommodation.name}
        >
          {accommodation.name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-600 mb-1">
          <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-sm truncate">{accommodation.city.title}</span>
        </div>
        
        {/* Review Count */}
        <div className="text-sm text-gray-500 mb-3">
          {accommodation.reviewCount} đánh giá
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 pt-3 mt-3">
          {/* Price Section */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Giá trung bình/đêm</p>
              <div className="flex items-baseline gap-1">
                <span className="text-orange-600">
                  {Number(accommodation.avgPrice).toLocaleString('vi-VN')}
                </span>
                <span className="text-sm text-gray-500">VND</span>
              </div>
            </div>
            
            {/* View Details Button */}
            <button className="px-4 py-2 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-700 transition-colors">
              Xem chi tiết
            </button>
          </div>
          
          {/* Tax Notice */}
          <p className="text-xs text-gray-400 mt-2">
            *Chưa bao gồm thuế và phí
          </p>
        </div>
      </div>
    </div>
  );
}
