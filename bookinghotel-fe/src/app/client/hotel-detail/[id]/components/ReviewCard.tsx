import { Review } from '../types';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Star, ThumbsUp } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={review.avatar} alt={review.name} />
            <AvatarFallback>{getInitials(review.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4>{review.name}</h4>
                <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

            <Button variant="ghost" size="sm" className="text-gray-600 gap-2">
              <ThumbsUp className="w-4 h-4" />
              Helpful ({review.helpful})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
