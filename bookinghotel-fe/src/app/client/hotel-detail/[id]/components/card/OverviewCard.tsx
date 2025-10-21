'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface OverviewCardProps {
  description?: string;
  highlights?: string[];
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  description,
  highlights = [
    'Wi-Fi miễn phí',
    'Bữa sáng ngon',
    'Hồ bơi ngoài trời',
    'Phòng gia đình',
    'Quầy bar mini',
    'Dịch vụ đưa đón sân bay',
  ],
}) => {
  return (
    <div className="p-6  rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        Tổng quan chỗ nghỉ
      </h3>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {description ||
          'Khách sạn tọa lạc tại trung tâm thành phố, chỉ vài phút đi bộ đến khu mua sắm và các điểm du lịch. Không gian hiện đại, thân thiện với thiên nhiên, phù hợp cho cả công tác và nghỉ dưỡng.'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {highlights.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Star className="w-4 h-4 text-sky-500 fill-sky-500" />
            <span className="text-gray-700 text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCard;
