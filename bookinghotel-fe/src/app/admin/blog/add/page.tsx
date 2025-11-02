"use client";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createBlog } from "@/reduxTK/features/blog/blogThunk";
import axios from "axios";

const AddPost = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("text");
  const [authorId, setAuthorId] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Load danh sách user khi vào trang
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách user:", error);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Gửi form tạo bài viết
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorId) {
      alert("Vui lòng chọn tác giả!");
      return;
    }

    const newPost = {
      title,
      content,
      author_id: Number(authorId),
      image: "/uploads/posts/post-1.png",
      is_public: true,
    };

    try {
      const result = await dispatch(createBlog(newPost)).unwrap();
      console.log("Created post:", result);
      alert("Thêm bài viết thành công!");
      // Reset form
      setTitle("");
      setContent("");
      setType("text");
      setAuthorId("");
      setImage(null);
    } catch (error: any) {
      console.error("Lỗi khi tạo bài viết:", error);
      alert("Thêm bài viết thất bại!");
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add Post</h1>
        <p className="text-gray-500 text-sm">/ Blog / Add Post</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Type</label>
            <div className="flex items-center gap-4">
              {["text", "image", "video"].map((option) => (
                <label key={option} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="type"
                    value={option}
                    checked={type === option}
                    onChange={(e) => setType(e.target.value)}
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ✅ Author Select */}
          <div>
            <label className="block text-sm font-semibold mb-2">Author</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Chọn tác giả --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.username || `User ${user.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold mb-2">Content</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="bg-white rounded-lg"
              placeholder="Write your post content here..."
            />
          </div>

          {/* Image upload */}
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-10 hover:bg-gray-50 cursor-pointer transition"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500 text-sm">
                📤 Drag & Drop or <span className="text-blue-600">Click to upload</span>
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        </form>

        {/* Right: Preview */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Preview</h2>
          {!title && !content ? (
            <p className="text-gray-400 italic">Start typing to preview...</p>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                By {users.find((u) => u.id === Number(authorId))?.name || "Anonymous"}
              </p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPost;
