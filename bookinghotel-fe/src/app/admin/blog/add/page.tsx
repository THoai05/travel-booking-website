"use client";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxTK/store";
import { createBlog } from "@/reduxTK/features/blog/blogThunk";
import { getAllUsers } from "@/reduxTK/features/user/userThunk";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");


const AddPost = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("text");
  const [author, setAuthor] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [cities, setCities] = useState<{ id: number; title: string }[]>([]);
  const [city, setCity] = useState<string>("Đà Nẵng");

  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading } = useSelector((state: RootState) => state.user);
  // console.log("🧾 users from redux:", users);

  // Gọi API user khi vào trang
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Nếu users có dữ liệu và author rỗng -> set mặc định là user đầu tiên (id)
  useEffect(() => {
    if (!author && users && users.length > 0) {
      setAuthor(String(users[0].id));
    }
  }, [users, author]);

  // Fetch cities khi component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost:3636/city");
        const json = await res.json();

        // Nếu API trả về object chứa data
        const citiesData = Array.isArray(json) ? json : json.data || [];
        setCities(citiesData);
        if (citiesData.length > 0) {
          setCity(citiesData[0].title); // default chọn city đầu tiên
        }
      } catch (err) {
        console.error("Lỗi khi lấy cities:", err);
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !author) {
      return alert("Vui lòng điền đủ thông tin");
    }

    const selectedUser = users.find(u => String(u.id) === author);
    const selectedCity = cities.find(c => c.title === city);

    if (!selectedUser || !selectedCity) {
      return alert("Author hoặc City không hợp lệ");
    }

    const slug = slugify(title);
    let imageUrl = "/uploads/posts/post-1.png";

    try {
      let uploadedUrls: string[] = []; // nhận tất cả URL trả về
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("http://localhost:3636/posts/upload-images", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Lỗi khi upload ảnh");
        const uploadData = await uploadRes.json();

        if (uploadData.urls && Array.isArray(uploadData.urls)) {
          uploadedUrls = uploadData.urls;
        }
      }
      const payload = {
        title,
        content,
        author_name: selectedUser.fullName,
        city_title: selectedCity.title,
        slug,
        is_public: true,
        images: uploadedUrls.length > 0 ? uploadedUrls : [],
      };

      const result = await dispatch(createBlog(payload)).unwrap();
      console.log("Created post:", result);
      alert("Thêm bài viết thành công!");

      // Reset form
      setTitle("");
      setContent("");
      setAuthor(users.length ? String(users[0].id) : "");
      setCity(cities.length ? cities[0].title : "");
      setType("text");
      setImages([]);

    } catch (err: any) {
      console.error("❌ Lỗi khi tạo bài viết:", err);
      alert("Thêm bài viết thất bại: " + (err.message || JSON.stringify(err)));
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add Post</h1>
        <p className="text-gray-500 text-sm">/ Blog / Add Post</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-6">
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
            <p className="mt-1 text-gray-500 text-sm">Slug: <span className="font-mono">{slugify(title)}</span></p>
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

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold mb-2">Author</label>
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Author --</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* City id (simple input) */}
          <div>
            <label className="block text-sm font-semibold mb-2">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
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

          {/* Upload multiple images */}
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed
          border-gray-300 rounded-lg py-10 hover:bg-gray-50 cursor-pointer transition"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFiles = Array.from(e.target.files);
                  // Kiểm tra dung lượng mỗi ảnh
                  const tooLarge = selectedFiles.find(f => f.size > 5 * 1024 * 1024); // 5MB
                  if (tooLarge) {
                    alert(`Ảnh "${tooLarge.name}" vượt quá 5MB, vui lòng chọn ảnh nhỏ hơn!`);
                    return;
                  }
                  setImages(selectedFiles);
                }
              }}
            />

            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((file, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Drag & Drop or <span className="text-blue-600">Click to upload multiple images</span>
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

        {/* Right side: Live Preview */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Preview</h2>

          {!title && !content ? (
            <p className="text-gray-400 italic">Start typing to preview...</p>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">By {users.find(u => String(u.id) === author)?.fullName || "Anonymous"}</p>
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
