'use client';

import { Star, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Helper: chuyển điểm thành chữ mô tả
const getRatingText = (rating: number) => {
  if (rating >= 9) return 'Tuyệt vời';
  if (rating >= 8) return 'Rất tốt';
  if (rating >= 7) return 'Tốt';
  if (rating >= 6) return 'Hài lòng';
  return 'Tạm ổn';
};

interface PropertySummaryCardProps {
  averageRating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
}

export default function PropertySummaryCard({
  averageRating,
  reviewCount,
  description,
  amenities,
}: PropertySummaryCardProps) {
  const reviewHighlights = [
    'Sạch sẽ',
    'Vị trí tuyệt vời',
    'Nhân viên thân thiện',
    'Giường thoải mái',
  ];

  const reviews = [
    {
      name: 'Nguyễn Thảo',
      rating: 4.8,
      text: 'Phòng sạch sẽ, giường cực kỳ thoải mái. Mình thích nhất là nhân viên rất thân thiện.',
    },
    {
      name: 'Minh Khang',
      rating: 4.6,
      text: 'Vị trí gần trung tâm, thuận tiện đi lại. Không gian yên tĩnh, sẽ quay lại lần sau!',
    },
    {
      name: 'Lê Hương',
      rating: 5.0,
      text: 'Bữa sáng ngon và phong phú, resort rất đáng tiền. Hoàn hảo cho kỳ nghỉ cuối tuần!',
    },
    {
      name: 'Ngọc Hà',
      rating: 4.7,
      text: 'Khuôn viên xanh mát, dịch vụ nhanh chóng, nhân viên thân thiện.',
    },
    {
      name: 'Phúc An',
      rating: 4.9,
      text: 'View biển cực đỉnh, thích hợp nghỉ dưỡng và chụp hình sống ảo.',
    },
  ];

  return (
    <div className="p-6 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm hover:shadow-md transition">
      {/* === Header Rating === */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center size-14 bg-blue-50 text-sky-700 rounded-lg">
          <span className="text-2xl font-bold">
            {averageRating?.toFixed(1)*2||0}/
            <span className="text-sky-500">10</span>
          </span>
        </div>

        <div className="ml-5">
          <p className="text-lg font-semibold text-gray-800">
            {getRatingText(averageRating)}
          </p>
          <a
            href="#reviews"
            className="text-sm text-sky-700 hover:underline flex items-center gap-1"
          >
            Từ {reviewCount} đánh giá
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* === Section title === */}
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        Khách nói gì về kỳ nghỉ của họ
      </h3>

      {/* === Tags === */}
      <div className="flex flex-wrap gap-2 mb-5">
        {reviewHighlights.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-medium shadow-sm"
          >
            {item}
          </Badge>
        ))}
      </div>

      {/* === Review List Scrollable === */}
      <div className="max-h-64 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-transparent">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-sky-100 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-sky-500 font-semibold text-sm">
                  {review.rating.toFixed(1)}
                </span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
