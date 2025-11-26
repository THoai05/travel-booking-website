'use client';

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/reduxTK/hook";
import { fetchReviewsByHotel } from "@/reduxTK/features/review/reviewThunk";
import {  resetReviews } from "@/reduxTK/features/review/reviewSlice";
import ReviewCard from "./ReviewCard";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Bird } from "lucide-react";
import CommentBox from "./ui/CommentBox";

interface DataReview {
  avgRating: number;
  reviewCount: number;
}

interface ReviewSectionProps {
  data: DataReview;
  hotelId: number;
}

export default function ReviewsSection({ data, hotelId }: ReviewSectionProps) {
  const dispatch = useAppDispatch();
  const { reviews, total, page, limit, loading } = useAppSelector((state) => state.reviews);

  // Gọi fetch lần đầu
  useEffect(() => {
    dispatch(resetReviews());
    dispatch(fetchReviewsByHotel({ hotelId, page: 1, limit }));
  }, [dispatch, hotelId, limit]);

  const handleLoadMore = () => {
    if (reviews.length < total && !loading) {
      dispatch(fetchReviewsByHotel({ hotelId, page: page + 1, limit }));
    }
  };

  const getRatingText = (rating: number) => {
    if (rating >= 9) return 'Tuyệt vời';
    if (rating >= 8) return 'Rất tốt';
    if (rating >= 7) return 'Tốt';
    if (rating >= 6) return 'Hài lòng';
    return 'Tạm ổn';
  };

  return (
    <section className="py-8 border-b">
      <CommentBox hotelId={hotelId} />
      <h2 className="my-6 text-2xl font-bold">Đánh giá của khách hàng</h2>

      <div className="mb-8">
        <Tabs defaultValue="Bluevera">
          <TabsList className="mb-6">
            <TabsTrigger value="Bluevera">Bluevera ({data?.reviewCount})</TabsTrigger>
            <TabsTrigger value="others">Nguồn khác (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="Bluevera">
            <div className="space-y-4 mb-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => <ReviewCard key={review.id} review={review} />)
              ) : (
                <p className="text-gray-500">Chưa có đánh giá nào cho khách sạn này.</p>
              )}
            </div>

            {reviews.length < total && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={handleLoadMore}
                >
                  {loading ? "Đang tải..." : "Load More Reviews"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="others">
            <p>No reviews from other sources.</p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
