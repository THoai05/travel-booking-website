"use client";
import Image from "next/image";
import { FaEye, FaEllipsisV, FaUser, FaRegCalendar } from "react-icons/fa";

interface PostItemProps {
  post: any;
  isSelected: boolean;
  toggleSelect: (id: number) => void;
  getPostImageUrl: (image: string) => string;
  openMenuFor: number | null;
  setOpenMenuFor: (id: number | null) => void;
  handleAction: (action: string, id: number) => void;
}

export default function PostItem({
  post,
  isSelected,
  toggleSelect,
  getPostImageUrl,
  openMenuFor,
  setOpenMenuFor,
  handleAction,
}: PostItemProps) {
  return (
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
          src={getPostImageUrl(post.image)}
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
            <p className="mt-1 text-sm text-gray-500 truncate">
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
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  post.is_public
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
              onClick={() => alert(`Xem bài '${post.title}'`)}
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
                    onClick={() => handleAction("edit", post.id)}
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
  );
}
