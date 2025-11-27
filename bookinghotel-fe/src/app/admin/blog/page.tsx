"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import Toolbar from "./Toolbar";
import PostItem from "./PostItem";
import Pagination from "../components/Pagination";
import { fetchAdminBlogs, deletePosts } from "@/reduxTK/features/blog/blogThunk";
import { AppDispatch, RootState } from "@/reduxTK/store";

export default function ModernSingleListPost() {
  const dispatch = useDispatch<AppDispatch>();
  const { adminBlogs, isLoading, error, adminPagination } = useSelector(
    (state: RootState) => state.blogs
  );

  // STATE
  const [query, setQuery] = useState("");
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openMenuFor, setOpenMenuFor] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const postsPerPage = 5;
  const { total = 0, page: currentPage = 1, limit = postsPerPage } = adminPagination || {};

  // EFFECT
  useEffect(() => {
    dispatch(fetchAdminBlogs({ page, limit: postsPerPage }));
  }, [dispatch, page]);

  const filtered = adminBlogs.filter((p: any) => {
    if (showPublicOnly && !p.is_public) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.author?.fullName?.toLowerCase().includes(q)
    );
  });

  const getPostImageUrl = (image: string) => {
    if (!image) return "/post1.png"; // fallback
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `http://localhost:3636${image}`; // prepend backend host
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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
        alert("Xóa thất bại.");
      }
    }
  };

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

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(total / limit)) return;
    setPage(newPage);
  };

  // RENDER
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

        <Toolbar
          query={query}
          setQuery={setQuery}
          showPublicOnly={showPublicOnly}
          setShowPublicOnly={setShowPublicOnly}
          selectedCount={selected.length}
          totalFiltered={filtered.length}
          onSelectAll={toggleSelectAll}
          selectAll={selectAll}
          onDeleteSelected={handleDeleteSelected}
        />

        {filtered.map((post: any, index) => (
          <PostItem
            key={post.id ?? index}
            post={post}
            isSelected={selected.includes(post.id)}
            toggleSelect={toggleSelect}
            getPostImageUrl={getPostImageUrl}
            openMenuFor={openMenuFor}
            setOpenMenuFor={setOpenMenuFor}
            handleAction={handleAction}
            onPostUpdated={() => dispatch(fetchAdminBlogs({ page, limit: postsPerPage }))}
          />
        ))}

        <Pagination
          currentPage={currentPage}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
