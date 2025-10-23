// components/ReviewsSection.tsx
'use client'

import { useHandleGetReviewsByHotelId } from '@/service/reviews/reviewService';
import { Review, ReviewSummary } from '../types';
import ReviewCard from './ReviewCard';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'; // Import Tabs
import { Building, Globe, ShieldCheck , Bird} from 'lucide-react'; // Icons ví dụ

//--- DỮ LIỆU MOCK (Thay thế bằng API của bro) ---

// Dữ liệu mock cho tóm tắt (Giống hình 2)
function generateFakeSummary(avgRating: number) {
  // Dao động nhỏ theo mức rating
  const range = avgRating*2 >= 8 ? 0.5 : avgRating >= 5 ? 0.7 : 1.0;

  const randomOffset = (maxDiff: number) =>
    avgRating*2 + (Math.random() * maxDiff - maxDiff / 2);

  return {
    categoryScores: [
      { category: "Sạch sẽ", score: randomOffset(range) },
      { category: "Trải ngiệm phòng", score: randomOffset(range) },
      { category: "Bữa ăn", score: randomOffset(range) },
      { category: "Cơ sở vật chất", score: randomOffset(range) },
      { category: "Phục vụ và tiện ích", score: randomOffset(range) },
    ].map((c) => ({
      ...c,
      score: Math.min(10, Math.max(1, Number(c.score.toFixed(1)))), // Giới hạn 1–10
    })),
  };
}


// Dữ liệu mock cho các review (Giống hình 1)
// Cập nhật ngày để 'formatDistanceToNow' hoạt động đúng
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();


//--- KẾT THÚC DỮ LIỆU MOCK ---

interface DataReview{
  avgRating: number
  reviewCount: number
}

interface ReviewSectionProbs {
  data: DataReview
  hotelId:number
}



export default function ReviewsSection({ data,hotelId }: ReviewSectionProbs) {
  console.log(hotelId)
  
  const {data:mockReviews} = useHandleGetReviewsByHotelId(hotelId)

  // Dùng dữ liệu mock
  const reviews = mockReviews || [];

  const getRatingText = (rating: number) => {
  if (rating >= 9) return 'Tuyệt vời';
  if (rating >= 8) return 'Rất tốt';
  if (rating >= 7) return 'Tốt';
  if (rating >= 6) return 'Hài lòng';
  return 'Tạm ổn';
  };
  
  const summary = generateFakeSummary(data?.avgRating || 8);
  

  return (
    <section className="py-8 border-b">
      <h2 className="mb-6 text-2xl font-bold">Đánh giá của khách hàng</h2>
      
      {/* --- Phần Tóm tắt (Hình 2) --- */}
      <div className="mb-8">
        <Tabs defaultValue="Bluevera">
          <TabsList className="mb-6">
            <TabsTrigger value="Bluevera">Bluevera ({data?.reviewCount})</TabsTrigger>
            <TabsTrigger value="others">Nguồn khác (1)</TabsTrigger>
          </TabsList>
          
          {/* Content cho Tab Bluevera */}
          <TabsContent value="Bluevera">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Cột 1: Điểm tổng quan */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-lg p-6 shadow-md border border-blue-100">
                <div className="text-7xl font-bold text-sky-600 mb-2">{Number(data?.avgRating * 2).toFixed(1)}</div>
                <div className="text-2xl font-semibold mb-2">{ getRatingText(Number(data?.avgRating)) }</div>
                <p className="text-gray-600 text-sm mb-4">Đến từ {data?.reviewCount} đánh giá</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Được cung cấp bởi</span>
                  <Bird className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold">Bluevera</span>
                </div>
              </div>

              {/* Cột 2: Breakdown theo danh mục */}
              <div className="md:col-span-2 space-y-4 my-auto">
                {summary.categoryScores.map((item) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <span className="text-gray-700 w-40">{item.category}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-sky-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 w-8 text-right">
                      {item.score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Content cho Tab Other sources */}
          <TabsContent value="others">
             <p>No reviews from other sources.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- Phần Danh sách Review (Hình 1) --- */}
      <div className="space-y-4 mb-6">
        {reviews && reviews.length > 0 && reviews.map((review) => (
  <ReviewCard key={review.id} review={review} />
))}
      </div>

      <div className="text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </section>
  );
}