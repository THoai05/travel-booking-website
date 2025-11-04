"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaEllipsisV,
  FaTrash,
  FaRegCalendar,
  FaUser,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxTK/store";
import Pagination from "../../components/Pagination";
import { fetchBlogs } from "@/reduxTK/features/blog/blogThunk";
import { deletePosts } from "@/reduxTK/features/blog/blogThunk";

export default function ModernSingleListPost() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, isLoading, error } = useSelector((state: RootState) => state.blogs);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [query, setQuery] = useState("");
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [openMenuFor, setOpenMenuFor] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const postsPerPage = 5;
  const { pagination } = useSelector((state: any) => state.blogs);
  const { total = 0, page: currentPage = 1, limit = postsPerPage } = pagination || {};

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(total / limit)) return;
    setPage(newPage);
  };

  useEffect(() => {
    dispatch(fetchBlogs({ page, limit: postsPerPage }));
  }, [dispatch, page]);

  // Hàm chuẩn URL ảnh
  const getPostImageUrl = (image: string) => {
    if (!image) return "/post1.png";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `http://localhost:3636${encodeURI(image)}`;
  };

  const filtered = blogs.filter((p: any) => {
    if (showPublicOnly && !p.is_public) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.author?.fullName?.toLowerCase().includes(q))
    );
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(filtered.map((p: any) => p.id));
      setSelectAll(true);
    }
  };
  
  // Hàm xóa bài đã chọn
  const handleDeleteSelected = async () => {
    if (selected.length === 0) return alert("Chọn ít nhất 1 bài để xóa");

    if (confirm(`Xóa ${selected.length} bài viết?`)) {
      try {
        await dispatch(deletePosts(selected)).unwrap();
        alert("Xóa thành công!");
        setSelected([]);
        setSelectAll(false);
      } catch (err) {
        console.error(err);
        alert("Xóa thất bại, thử lại.");
      }
    }
  };

  // Xóa 1 bài đơn lẻ từ menu
  const handleAction = async (action: string, id: number) => {
    setOpenMenuFor(null);
    if (action === "delete") {
      if (confirm("Xác nhận xóa bài này?")) {
        try {
          await dispatch(deletePosts([id])).unwrap();
          alert("Xóa thành công!");
        } catch (err) {
          console.error(err);
          alert("Xóa thất bại.");
        }
      }
    }
  };

  if (isLoading) return <p className="p-6">Đang tải dữ liệu blog...</p>;
  if (error) return <p className="p-6 text-red-500">Lỗi khi tải dữ liệu.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Blog Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">/ Blog / Single</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog/add"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-500
            text-white px-4 py-2 rounded-lg shadow-md hover:opacity-95 transition"
            >
              <FaPlus />
              <span className="font-medium">Add Post</span>
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="relative w-full sm:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm bài viết hoặc tác giả..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch />
              </span>
            </label>

            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
                <input
                  type="checkbox"
                  checked={showPublicOnly}
                  onChange={() => setShowPublicOnly((s) => !s)}
                />
                <span className="text-sm text-gray-600">Public only</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="w-4 h-4"
                onChange={toggleSelectAll}
                checked={selected.length > 0 && selected.length === filtered.length}
              />
              <span>{selected.length} selected</span>
            </div>

            <button
              onClick={handleDeleteSelected}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm 
              font-medium transition shadow-sm ${selected.length > 0
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
                }`}
            >
              <FaTrash className="text-base" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="divide-y">
            {filtered.length === 0 && (
              <div className="p-8 text-center text-gray-500">Không có bài viết nào</div>
            )}

            {filtered.map((post: any) => {
              const isSelected = selected.includes(post.id);
              return (
                <div
                  key={post.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5
                 hover:bg-gray-50 transition ${isSelected ? "ring-2 ring-sky-200 bg-sky-50" : ""
                    }`}
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
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            total={total}
            limit={limit}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
