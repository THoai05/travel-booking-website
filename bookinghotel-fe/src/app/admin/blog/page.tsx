"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import Toolbar from "./Toolbar";
import PostItem from "./PostItem";
import Pagination from "../components/Pagination";
import { fetchAdminBlogs, deletePosts, createBlog } from "@/reduxTK/features/blog/blogThunk";
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

  // EFFECT: load posts
  useEffect(() => {
    dispatch(fetchAdminBlogs({ page, limit: postsPerPage }));
  }, [dispatch, page]);

  // Filter posts
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
    if (!image) return "/post1.png";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `http://localhost:3636${image}`;
  };

  // Select functions
  const toggleSelect = (id: number) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
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

  // Delete posts
  const handleDeleteSelected = async () => {
    if (selected.length === 0) return alert("Chọn ít nhất 1 bài để xóa");
    if (!confirm(`Xóa ${selected.length} bài viết?`)) return;
    try {
      await dispatch(deletePosts(selected)).unwrap();
      alert("Xóa thành công!");
      setSelected([]);
      setSelectAll(false);
      dispatch(fetchAdminBlogs({ page, limit: postsPerPage }));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại.");
    }
  };

  // Duplicate post
  const duplicatePost = async (post: any) => {
    try {
      // Tạo dữ liệu mới, giữ nguyên images
      const payload = {
        title: `Copy of ${post.title}`,
        content: post.content,
        images: post.images || [],
        is_public: post.is_public,
        author_name: post.author?.fullName || "Unknown",
      };
      await dispatch(createBlog(payload)).unwrap();
      alert("Duplicate thành công!");
      dispatch(fetchAdminBlogs({ page, limit: postsPerPage }));
    } catch (err) {
      console.error(err);
      alert("Duplicate thất bại!");
    }
  };

  // Handle individual actions
  const handleAction = async (action: string, postId: number) => {
    setOpenMenuFor(null);
    const post = adminBlogs.find(p => p.id === postId);
    if (!post) return;

    switch (action) {
      case "delete":
        if (confirm("Xác nhận xóa bài này?")) {
          try {
            await dispatch(deletePosts([postId])).unwrap();
            alert("Xóa thành công!");
            dispatch(fetchAdminBlogs({ page, limit: postsPerPage }));
          } catch (err) {
            console.error(err);
            alert("Xóa thất bại.");
          }
        }
        break;
      case "duplicate":
        duplicatePost(post);
        break;
      default:
        break;
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Blog Management</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Link href="/admin">Admin</Link>
              <span>/</span>
              <span className="font-medium text-gray-700">Blogs</span>
            </div>
          </div>

          <Link
            href="/admin/blog/add"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-all duration-200 active:scale-95"
          >
            <FaPlus />
            <span className="font-medium">New Post</span>
          </Link>
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
