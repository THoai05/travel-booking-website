"use client";

import { Review } from "../types";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { ThumbsUp, Star, MoreVertical, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/reduxTK/hook";
import { deleteReviewThunk, likeReviewThunk } from "@/reduxTK/features/review/reviewThunk";
import { useAuth } from "@/context/AuthContext";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();

  // --- Local state để optimistic update ---
  const [isLiked, setIsLiked] = useState(review.isLiked || false);
  const [likeCount, setLikeCount] = useState(review.likeCount || 0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete = currentUser?.id === review.user.id;

  useEffect(() => {
    // Đồng bộ nếu review prop thay đổi
    setIsLiked(review.isLiked || false);
    setLikeCount(review.likeCount || 0);
  }, [review.isLiked, review.likeCount]);

  const getInitials = (name?: string): string =>
    name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "?";

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Đánh giá ${formatDistanceToNow(date, { addSuffix: true, locale: vi })}`;
    } catch {
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
          className={`w-5 h-5 ${i <= normalizedRating ?
             "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-200"}`}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xoá đánh giá này không?")) return;
    try {
      setDeleting(true);
      await dispatch(deleteReviewThunk(review.id));
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  const handleLike = async () => {
    // --- Optimistic update ngay UI ---
    setIsLiked(prev => !prev);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));

    try {
      await dispatch(likeReviewThunk(review.id));
    } catch (err) {
      // Nếu backend fail, rollback
      setIsLiked(prev => !prev);
      setLikeCount(prev => (isLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <>
      <Card className="border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm rounded-lg relative">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="w-12 h-12">
              <AvatarImage src={review?.user?.avatar || "/default-avatar.jpg"} alt={review?.user?.name || "User"} />
              <AvatarFallback>{getInitials(review?.user?.username)}</AvatarFallback>
            </Avatar>

            {/* Nội dung review */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 relative">
                <div className="mb-2 sm:mb-0">
                  <h4 className="font-semibold">{review?.user?.username || "Ẩn danh"}</h4>
                  <div>{renderStars(review?.rating)}</div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 relative">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{formatDate(review?.createdAt)}</p>
                    {canDelete && (
                      <button onClick={() => setShowMenu(prev => !prev)} className="p-1 hover:bg-sky-100 rounded-full transition">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    )}
                  </div>

                  {showMenu && canDelete && (
                    <div className="absolute top-7 right-0 bg-white border border-gray-200 rounded-lg shadow-md w-36 z-10">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleting ? "Đang xoá..." : "Xoá đánh giá"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: review?.comment || "" }} />

              {review?.images?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="relative cursor-pointer group"
                    onClick={() => setSelectedImage(`http://localhost:3636${img}`)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`http://localhost:3636${img}`} alt={`review-${idx}`}
                      className="w-full h-32 object-cover rounded-lg border border-sky-100 group-hover:opacity-80 transition-all" />
                      <div className="absolute inset-0 bg-black/20 opacity-0
                      group-hover:opacity-100 transition-opacity rounded-lg" />
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 mb-4">
                Được dịch tự động –{" "}
                <Button variant="link" className="p-0 h-auto text-sky-600">Xem bản gốc</Button>
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 px-2 ${isLiked ? "text-yellow-500" : "text-gray-600 hover:text-sky-500"}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                {likeCount > 0 && <p className="text-sm text-gray-600">{likeCount} người thấy hữu ích</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center 
        justify-center z-50" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="zoom" className="max-w-[90%]
          max-h-[85%] rounded-lg shadow-lg border border-gray-300" />
        </div>
      )}
    </>
  );
}
