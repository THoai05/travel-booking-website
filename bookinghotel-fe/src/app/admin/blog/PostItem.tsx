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
        hover:bg-gray-50 transition ${isSelected ? "ring-2 ring-sky-200 bg-sky-50" : ""}`}
      >
        <div className="flex items-start gap-3 w-full sm:w-auto">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(post.id)}
            className="mt-1 w-4 h-4"
          />
          <Image
            src={getPostImageUrl(post.images?.[0] || "")}
            width={64}
            height={64}
            alt={post.title}
            className="w-16 h-16 rounded-lg object-cover shadow-sm"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {post.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-3">
                {post.content.replace(/<[^>]+>/g, "")}
              </p>

              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <FaUser /> {post.author?.username || "Unknown"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FaRegCalendar /> {post.created_at || "N/A"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${post.is_public
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {post.is_public ? "Public" : "Private"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
                bg-sky-600 text-white text-sm shadow-sm hover:opacity-95"
              >
                <FaEye /> <span>View</span>
              </button>

              <div className="relative">
                <button
                  aria-expanded={openMenuFor === post.id}
                  onClick={() =>
                    setOpenMenuFor((v) => (v === post.id ? null : post.id))
                  }
                  className="p-2 rounded-lg border border-gray-100 bg-white shadow-sm hover:bg-gray-50"
                >
                  <FaEllipsisV />
                </button>

                {openMenuFor === post.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAction("duplicate", post.id)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleAction("archive", post.id)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Archive
                    </button>
                    <div className="border-t" />
                    <button
                      onClick={() => handleAction("delete", post.id)}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
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
                alert("Cập nhật thành công!");
                onPostUpdated();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
