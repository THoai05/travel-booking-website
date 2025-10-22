import { reviews } from '../data/mockData';
import ReviewCard from './ReviewCard';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import CommentBox from './ui/CommentBox';

export default function ReviewsSection() {
  const averageRating = (
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  ).toFixed(1);

  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });

  return (
    <section className="py-8 border-b">
      <div className="mb-8">
        <div className="py-3 flex justify-start">
          <CommentBox />
        </div>
        <h2 className="mb-6">Guest Reviews</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              <span className="text-blue-600">{averageRating}</span>
            </div>
            <p className="text-gray-600">Based on {reviews.length} reviews</p>
          </div>

          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating] || 0;
              const percentage = (count / reviews.length) * 100;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </section>
  );
}
