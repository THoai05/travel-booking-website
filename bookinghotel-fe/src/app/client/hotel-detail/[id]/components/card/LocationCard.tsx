// components/LocationCard.tsx
'use client';

import { MapPin, Map, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NearbyPlace {
  name: string;
  distance: string;
}

interface LocationCardProps {
  address: string;
  cityName: string;
  tag: string;
  nearbyPlaces: NearbyPlace[];
  onSeeMap: (city: string) => void;
}

export default function LocationCard({
  address,
  cityName,
  tag,
  nearbyPlaces,
  onSeeMap,
}: LocationCardProps) {
  return (
    <div className="p-6 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm hover:shadow-md transition">
      {/* === Header === */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Khu vực xung quanh
        </h3>

        <Button
          variant="link"
          className="text-sky-600 hover:text-sky-800 p-0 h-auto font-medium flex items-center gap-1"
          onClick={() => onSeeMap(cityName)}
        >
          Xem bản đồ
          <Map className="w-4 h-4" />
        </Button>
      </div>

      {/* === Địa chỉ === */}
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-sky-100 rounded-full p-2 flex-shrink-0">
          <MapPin className="w-4 h-4 text-sky-600" />
        </div>
        <p className="text-gray-700 leading-relaxed">{address}</p>
      </div>

      {/* === Tag nổi bật === */}
      <div className="mb-5">
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-blue-100 to-sky-100 text-sky-700 font-medium shadow-sm"
        >
          <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
          Địa điểm lận cận
        </Badge>
      </div>

      {/* === Danh sách địa điểm lân cận === */}
      <div className="space-y-3 divide-y divide-sky-100">
        {nearbyPlaces?.map((place, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span className="text-gray-800">{place.name}</span>
            </div>
            <span className="text-sm text-gray-600">{place.distance} Km </span>
          </div>
        ))}
      </div>
    </div>
  );
}
