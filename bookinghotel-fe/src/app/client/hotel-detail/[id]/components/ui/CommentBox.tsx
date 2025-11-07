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
  FaStar,
} from "react-icons/fa";

export default function CommentBox() {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    console.log("Comment:", comment, "Rating:", rating);
    setComment("");
    setRating(0);
  };

  return (
    <div className="w-full max-w-5xl bg-[#f3f7fb] border border-blue-100 rounded-2xl p-4 shadow-sm">
      {/* Star Rating */}
      <div className="flex items-center mb-3 gap-1">
        {[...Array(5)].map((_, idx) => {
          const starValue = idx + 1;
          const filled = hoverRating >= starValue || (!hoverRating && rating >= starValue);
          return (
            <span
              key={idx}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className={`cursor-pointer transition-transform duration-150 ${
                filled ? "text-yellow-400" : "text-gray-300"
              } hover:scale-110`}
            >
              <FaStar className="w-5 h-5" />
            </span>
          );
        })}
        {rating > 0 && <span className="text-sm text-gray-500 ml-2">{rating} / 5</span>}
      </div>

      {/* Textarea */}
      <textarea
        className="w-full bg-transparent outline-none resize-none
          text-gray-700 placeholder-gray-400 text-sm min-h-[70px] p-2 rounded-lg border border-blue-100 focus:ring-1 focus:ring-sky-300"
        placeholder="Thêm bình luận..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Toolbar + Submit */}
      <div className="flex items-center justify-between mt-3">
        {/* Toolbar */}
        <div className="flex items-center space-x-3 text-sky-500">
          {[FaBold, FaItalic, FaUnderline, FaPaperclip, FaImage, FaSmile, FaAt].map(
            (Icon, idx) => (
              <span
                key={idx}
                className="cursor-pointer hover:text-sky-700 transition-colors duration-200"
              >
                <Icon />
              </span>
            )
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5
            rounded-full text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!comment.trim()}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
