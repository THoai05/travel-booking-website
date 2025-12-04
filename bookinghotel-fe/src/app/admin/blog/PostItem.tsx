"use client";
import { useState } from "react";
import Image from "next/image";
import { FaEye, FaEllipsisV, FaUser, FaRegCalendar } from "react-icons/fa";
import EditPostForm from "../components/EditPostForm";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PostItemProps {
  post: any;
  isSelected: boolean;
  toggleSelect: (id: number) => void;
  getPostImageUrl: (image: string) => string;
  openMenuFor: number | null;
  setOpenMenuFor: (id: number | null) => void;
  handleAction: (action: string, id: number) => void;
  onPostUpdated: () => void;
}

export default function PostItem({
  post,
  isSelected,
  toggleSelect,
  getPostImageUrl,
  openMenuFor,
  setOpenMenuFor,
  handleAction,
  onPostUpdated
}: PostItemProps) {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Component con để xử lý content với line-clamp
  const PostItemContent = ({ content }: { content: string }) => {
    const [showFull, setShowFull] = useState(false);
    const cleanContent = content.replace(/<[^>]+>/g, "");

    return (
      <div className="mt-1">
        <p
          className={`text-sm text-gray-500 leading-relaxed transition-all 
          duration-300 ${!showFull ? "line-clamp-3" : ""
            }`}
        >
          {cleanContent}
        </p>
        {cleanContent.length > 100 && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-blue-600 hover:underline text-xs mt-1 inline-block"
          >
            {showFull ? "Thu gọn" : "Xem đầy đủ"}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* --- Post item --- */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5
        border-b border-gray-200 transition ${isSelected ? "bg-gray-50" : "bg-white"}`}
      >
        {/* Checkbox + Thumbnail */}
        <div className="flex items-start gap-3 w-full sm:w-auto">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(post.id)}
            className="mt-1 w-4 h-4 accent-black cursor-pointer"
          />

          <Image
            src={getPostImageUrl(post.images?.[0] || "")}
            width={72}
            height={72}
            alt={post.title}
            className="w-18 h-18 rounded-lg object-cover border border-gray-200"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 truncate text-base">
                {post.title}
              </h3>

              <p className="text-sm text-gray-500 line-clamp-2">
                {post.content.replace(/<[^>]+>/g, "")}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <FaUser className="text-gray-400" /> {post.author?.username || "Unknown"}
                </span>

                <span className="inline-flex items-center gap-1">
                  <FaRegCalendar className="text-gray-400" /> {post.created_at || "-"}
                </span>

                <span
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide
            ${post.is_public
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {post.is_public ? "PUBLIC" : "PRIVATE"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* View Button Minimal Ghost */}
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md
          hover:bg-gray-100 transition"
              >
                View
              </button>

              {/* More Menu */}
              <div className="relative">
                <button
                  aria-expanded={openMenuFor === post.id}
                  onClick={() =>
                    setOpenMenuFor((v) => (v === post.id ? null : post.id))
                  }
                  className="p-1.5 rounded-md border border-gray-200 
            hover:bg-gray-100 transition"
                >
                  <FaEllipsisV className="text-gray-600" />
                </button>

                {openMenuFor === post.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-sm z-20 text-sm">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAction("duplicate", post.id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleAction("archive", post.id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      Archive
                    </button>
                    <div className="border-t" />
                    <button
                      onClick={() => handleAction("delete", post.id)}
                      className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal View --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto relative">
            <h2 className="text-xl font-bold mb-4">{post.title}</h2>

            {/* Swiper carousel cho ảnh */}
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
            >
              {post.images?.map((img, idx) => (
                <SwiperSlide key={idx} className="flex justify-center items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPostImageUrl(img)}
                    alt={`${post.title}-${idx}`}
                    className="w-full h-80 sm:h-96 object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div
              className="prose max-w-full mt-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <p className="mt-2 text-sm text-gray-600">
              Author: {post.author.fullName} ({post.author.username})
            </p>
            <p className="text-sm text-gray-600">
              Status: {post.is_public ? "Public" : "Private"}
            </p>
            <p className="text-sm text-gray-600">
              Created: {new Date(post.created_at).toLocaleString()}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:opacity-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- Modal Edit --- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto relative">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa bài viết</h2>
            <EditPostForm
              post={post}
              onClose={() => setShowEditModal(false)}
              onUpdated={() => {
                setShowEditModal(false);
                onPostUpdated();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
