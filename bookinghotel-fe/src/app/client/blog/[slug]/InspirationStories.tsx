"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/reduxTK/hook";
import { fetchRelatedPosts } from "@/reduxTK/features/blog/blogThunk";
import Link from "next/link";

interface Props {
  cityId: number;
  excludeSlug: string;
  cityName?: string;
}

const InspirationStories = ({ cityId, excludeSlug, cityName }: Props) => {
  const dispatch = useAppDispatch();
  const { related, isRelatedLoading } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    if (cityId) {
      dispatch(fetchRelatedPosts({ cityId, excludeSlug }));
    }
  }, [cityId, excludeSlug, dispatch]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h3 className="text-2xl font-bold mb-8">
        Những bài viết truyền cảm hứng về{" "}
        <span className="text-yellow-600">{cityName || "địa phương này"}</span>
      </h3>

      {/* Loading */}
      {isRelatedLoading && (
        <div className="text-gray-500 text-center py-10">Đang tải...</div>
      )}

      {/* Không có bài */}
      {!isRelatedLoading && related.length === 0 && (
        <div className="text-gray-500 text-center py-10">
          Chưa có bài viết liên quan.
        </div>
      )}

      {/* Danh sách bài liên quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((item: any, index: number) => (
          <Link
            href={`/blog/${item.slug}`}
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <Image
              src={
                item.images?.[0]?.url
                  ? `http://localhost:3636${item.images[0].url}`
                  : "/placeholder.jpg"
              }
              alt={item.title}
              width={400}
              height={300}
              className="w-full h-[220px] object-cover"
            />
            <div className="p-4 text-sm font-medium">{item.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default InspirationStories;
