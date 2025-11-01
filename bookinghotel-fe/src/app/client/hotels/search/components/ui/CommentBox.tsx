"use client";

import { useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaPaperclip,
  FaImage,
  FaSmile,
  FaAt,
} from "react-icons/fa";

export default function CommentBox() {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) return;
    console.log("Comment:", comment);
    setComment("");
  };

  return (
    <div className="w-full max-w-4xl bg-[#f3f7fb] border border-blue-100 rounded-2xl p-4 shadow-sm">
      <textarea
        className="w-full bg-transparent outline-none resize-none text-gray-700 placeholder-gray-400 text-sm"
        rows={3}
        placeholder="Thêm bình luận..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-4 text-blue-500">
          <button className="hover:text-blue-700">
            <FaBold />
          </button>
          <button className="hover:text-blue-700">
            <FaItalic />
          </button>
          <button className="hover:text-blue-700">
            <FaUnderline />
          </button>

          <div className="w-px h-5 bg-blue-100 mx-2" />

          <button className="hover:text-blue-700">
            <FaPaperclip />
          </button>
          <button className="hover:text-blue-700">
            <FaImage />
          </button>
          <button className="hover:text-blue-700">
            <FaSmile />
          </button>
          <button className="hover:text-blue-700">
            <FaAt />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm transition-colors"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
