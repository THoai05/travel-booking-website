// components/ReviewCard.tsx

import { Review } from '../types';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Bird, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale'; // ✅ để format tiếng Việt (tùy chọn)

// --- Interface props ---
interface ReviewCardProps {
  review: Review;
}

// --- Component ---
export default function ReviewCard({ review }: ReviewCardProps) {

  // 🧩 1. Lấy chữ cái đầu của tên user
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // 🧩 2. Format ngày “cách đây x ngày”
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Đánh giá ${formatDistanceToNow(date, { addSuffix: true, locale: vi })}`;
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Đánh giá gần đây';
    }
  };

  // 🧩 3. Hàm xử lý text “Hữu ích” (demo)
  const helpfulText = () => {
    // Giả lập dữ liệu — sau này bạn có thể thay bằng trường `helpfulCount` trong DB
    const randomCount = Math.floor(Math.random() * 10);
    return randomCount > 0 ? `${randomCount} người thấy hữu ích` : '';
  };

  return (
    <Card className="border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm rounded-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={review?.user?.avatar || '/default-avatar.jpg'}
              alt={review?.user?.name || 'User'}
            />
            <AvatarFallback>{getInitials(review?.user?.username)}</AvatarFallback>
          </Avatar>

          {/* Nội dung review */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
              
              {/* Tên người review */}
              <div className="mb-2 sm:mb-0">
                <h4 className="font-semibold">{review?.user?.username || 'Ẩn danh'}</h4>
              </div>

              {/* Điểm + Ngày */}
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-1 rounded-full bg-blue-100 text-sky-700 px-3 py-1 text-sm font-semibold">
                  <Bird className="w-4 h-4" />
                  <span>
                    {typeof review?.rating === 'number'
                      ? `${(review.rating * 2).toFixed(1)} / 10`
                      : 'Chưa có điểm'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{formatDate(review?.createdAt)}</p>
              </div>
            </div>

            {/* Nội dung bình luận */}
            <p className="text-gray-700 mb-4 leading-relaxed">{review?.comment}</p>

            {/* Ghi chú dịch tự động */}
            <p className="text-sm text-gray-500 mb-4">
              Được dịch tự động –{' '}
              <Button variant="link" className="p-0 h-auto text-sky-600">
                Xem bản gốc
              </Button>
            </p>

            {/* Nút hữu ích */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-sky-500 gap-2 px-2"
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <p className="text-sm text-gray-600">{helpfulText()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
