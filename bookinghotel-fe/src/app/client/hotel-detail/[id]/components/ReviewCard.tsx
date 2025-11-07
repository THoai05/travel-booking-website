import { Review } from '../types';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Bird, ThumbsUp, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Lấy chữ cái đầu của tên user
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Format ngày “cách đây x ngày”
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Đánh giá ${formatDistanceToNow(date, { addSuffix: true, locale: vi })}`;
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Đánh giá gần đây';
    }
  };

  // Hàm xử lý text “Hữu ích”
  const helpfulText = () => {
    const randomCount = Math.floor(Math.random() * 10);
    return randomCount > 0 ? `${randomCount} người thấy hữu ích` : '';
  };

  const renderStars = (rating?: number) => {
    const stars = [];
    const normalizedRating = typeof rating === 'number' ? Math.round(rating) : 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= normalizedRating ? 'text-yellow-400' : 'text-gray-300'
            }`}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
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
                <div>{renderStars(review?.rating)}</div>
              </div>

              {/* Điểm + Ngày */}
              <div className="flex flex-col sm:items-end gap-2">
                
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
