"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock, MessageSquare, ArrowRight } from "lucide-react";
import Button from "../components/common/Button";
import { fetchPublicBlogs } from "@/reduxTK/features/blog/blogThunk";
import { AppDispatch, RootState } from "@/reduxTK/store";
import Link from "next/link";

export default function TravelTips() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, isLoading, error } = useSelector((state: RootState) => state.blogs);

  useEffect(() => {
    // Lấy 3 bài viết đầu tiên cho homepage
    dispatch(fetchPublicBlogs({ page: 1, limit: 3 }));
  }, [dispatch]);

  // useEffect(() => {
  //   if (blogs && blogs.length > 0) {
  //     blogs.forEach((blog: any, index: number) => {
  //       console.log(`Blog #${index + 1}:`, blog.title);
  //       console.log("Images array:", blog.images);
  //     });
  //   }
  // }, [blogs]);

  // Lấy ảnh đầu tiên trong mảng images + fallback
  const getPostImageUrl = (images?: string[]) => {
    if (!images || images.length === 0) return "/post1.png"; // fallback
    const firstImage = images[0];
    if (!firstImage) return "/post1.png";
    if (firstImage.startsWith("http")) return firstImage;
    return `http://localhost:3636${firstImage}`;
  };

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Đang tải bài viết...</p>;

  if (error)
    return <p className="text-center py-10 text-red-500">Không thể tải bài viết.</p>;

  if (blogs.length === 0)
    return <p className="text-center py-10 text-gray-500">Chưa có bài viết nào.</p>;

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-start w-full">
            <h2 className="text-5xl font-bold mb-3">Tin tức & Mẹo du lịch</h2>
            <p className="text-gray-500">
              Khám phá hành trình, bí kíp và xu hướng du lịch mới nhất từ Bluevera
            </p>
          </div>
          <div>
            <Link href="/blog">
              <Button
                type="button"
                title="Xem thêm"
                icon={ArrowRight}
                variant="bg-black text-white px-6 py-3 hover:bg-gray-800 transition"
              />
            </Link>
          </div>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <div
              key={blog.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative w-full h-[250px]">
                <Image
                  src={getPostImageUrl(blog.images)}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-white text-sm font-medium px-3 py-1 rounded-full">
                  {blog.city?.title || "Du lịch"}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm gap-4 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />{" "}
                    {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> 6 phút đọc
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} /> 0 bình luận
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-4 leading-snug">
                  {blog.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/author.png"
                      alt={blog.author?.fullName || "Tác giả"}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium">
                      {blog.author?.fullName || "Ẩn danh"}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-sm bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition inline-block"
                  >
                    Keep Reading
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
