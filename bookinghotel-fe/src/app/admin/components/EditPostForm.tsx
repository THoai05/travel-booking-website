"use client";
import { useState } from "react";
import axios from "axios";

export default function EditPostForm({ post, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    content: post.content,
    is_public: post.is_public,
    image: post.image,
  });

  const [preview, setPreview] = useState(form.image ? `http://localhost:3636${form.image}` : "");

  // Xử lý thay đổi text input / checkbox
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý khi chọn file ảnh mới
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3636/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.url; // ví dụ: /uploads/posts/abc.jpg
      setForm((prev) => ({ ...prev, image: imageUrl }));
      setPreview(`http://localhost:3636${imageUrl}`);
    } catch (error) {
      console.error("Upload ảnh lỗi:", error);
      alert("Tải ảnh thất bại!");
    }
  };

  // Gửi form cập nhật
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3636/posts/${post.id}`, form);
      alert("Cập nhật thành công!");
      onUpdated();
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Chỉnh sửa bài viết
      </h2>

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

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Ảnh đại diện</label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-lg border mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block text-sm text-gray-600"
        />
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
