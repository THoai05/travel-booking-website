import { Review } from "../types";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThumbsUp, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Lấy chữ cái đầu của tên user
  const getInitials = (name?: string): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format ngày “cách đây x ngày”
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Đánh giá ${formatDistanceToNow(date, { addSuffix: true, locale: vi })}`;
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Đánh giá gần đây";
    }
  };

  const renderStars = (rating?: number) => {
    const stars = [];
    const normalizedRating = typeof rating === "number" ? Math.round(rating) : 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= normalizedRating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-200"
          }`}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <>
      <Card className="border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm rounded-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={review?.user?.avatar || "/default-avatar.jpg"}
                alt={review?.user?.name || "User"}
              />
              <AvatarFallback>{getInitials(review?.user?.username)}</AvatarFallback>
            </Avatar>

            {/* Nội dung review */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                {/* Tên người review */}
                <div className="mb-2 sm:mb-0">
                  <h4 className="font-semibold">
                    {review?.user?.username || "Ẩn danh"}
                  </h4>
                  <div>{renderStars(review?.rating)}</div>
                </div>

                {/* Ngày */}
                <div className="flex flex-col sm:items-end gap-2">
                  <p className="text-sm text-gray-500">
                    {formatDate(review?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Nội dung bình luận */}
              <p
                className="text-gray-700 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: review?.comment || "" }}
              />

              {/* Hình ảnh review */}
              {review?.images && review.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                  {review.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative cursor-pointer group"
                      onClick={() =>
                        setSelectedImage(`http://localhost:3636${img}`)
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`http://localhost:3636${img}`}
                        alt={`review-${idx}`}
                        className="w-full h-32 object-cover rounded-lg border border-sky-100 group-hover:opacity-80 transition-all"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    </div>
                  ))}
                </div>
              )}

              {/* Ghi chú dịch tự động */}
              <p className="text-sm text-gray-500 mb-4">
                Được dịch tự động –{" "}
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
                {review.likeCount > 0 && (
                  <p className="text-sm text-gray-600">
                    {review.likeCount} người thấy hữu ích
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal xem ảnh lớn */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt="zoom"
            className="max-w-[90%] max-h-[85%] rounded-lg shadow-lg border border-gray-300"
          />
        </div>
      )}
    </>
  );
}
