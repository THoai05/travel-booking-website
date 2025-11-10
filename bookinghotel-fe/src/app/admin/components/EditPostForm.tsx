"use client";
import { useState } from "react";
import api from "@/axios/axios";

export default function EditPostForm({ post, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    content: post.content,
    is_public: post.is_public,
    images: post.images || [],
  });

  const [previews, setPreviews] = useState(
    post.images?.map((img) => `http://localhost:3636${img}`) || []
  );

  const [isUploading, setIsUploading] = useState(false);

  // Thay đổi text hoặc checkbox
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Upload nhiều ảnh
  const handleFileChange = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      setIsUploading(true);
      const res = await api.post("/posts/upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrls = res.data.urls || [];
      if (uploadedUrls.length === 0) throw new Error("Không có ảnh nào được trả về!");

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      setPreviews((prev) => [
        ...prev,
        ...uploadedUrls.map((url) => `http://localhost:3636${url}`),
      ]);
    } catch (error) {
      console.error("Upload ảnh lỗi:", error);
      alert("Tải ảnh thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  // Xóa ảnh khỏi danh sách preview + form
  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Gửi form cập nhật
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api.patch(`/posts/${post.id}`, form);

      alert("Cập nhật thành công!");
      onUpdated();
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn hoặc chưa đăng nhập!");
      } else {
        alert("Cập nhật thất bại!");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Chỉnh sửa bài viết</h2>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Tiêu đề</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Slug</label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Nội dung</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg w-full p-2 h-28 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_public"
          checked={form.is_public}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <span className="text-gray-700 text-sm">Công khai bài viết</span>
      </div>

      {/* --- Nhiều ảnh --- */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Ảnh bài viết</label>

        <div className="flex flex-wrap gap-3 mb-3">
          {previews.map((src, idx) => (
            <div key={idx} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block text-sm text-gray-600"
        />

        {isUploading && <p className="text-xs text-gray-500 mt-1">Đang tải ảnh...</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}
