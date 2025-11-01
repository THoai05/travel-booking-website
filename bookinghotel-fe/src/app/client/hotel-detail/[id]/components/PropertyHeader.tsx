import { PropertyDetail } from '../types';
import { Star, MapPin, Share2, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface PropertyHeaderProps {
  property: PropertyDetail;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  console.log(property)
  return (
    <div className="py-6 border-b border-gray-100">
      {/* Row 1: Name + Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              {property?.name||"Bluevera"}
            </h1>
            <Badge className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm">
              {"Khách sạn " +Math.floor(property?.summaryReview?.avgRating) +" sao" || "Bluevera"}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span>{property?.city.title||"city title"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-800">{Number(property?.summaryReview.avgRating||0).toFixed(1)||0}</span>
              <span className="text-gray-500">({property?.summaryReview.reviewCount||0} đánh giá)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-sky-50 hover:text-sky-600 border-sky-100"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-rose-50 hover:text-rose-600 border-rose-100"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Row 2: Highlighted Rating Summary */}
      <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium">
            ⭐ {Number(property?.summaryReview.avgRating||0).toFixed(1)} / 5.0
          </span>
          <span className="text-gray-500">Dựa trên {property?.summaryReview.reviewCount||0} đánh giá</span>
        </div>
        <div className="text-sky-700 font-semibold cursor-pointer hover:underline">
          Xem bản đồ
        </div>
      </div>
    </div>
  );
}
