"use client";

import { useState, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { FaBold, FaItalic, FaUnderline, FaSmile, FaImage, FaStar } from "react-icons/fa";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export default function CommentBox() {
  const [commentHtml, setCommentHtml] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const editableRef = useRef<HTMLElement>(null);

  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    editableRef.current?.focus();
  };

  const handleEmojiSelect = (emoji: any) => {
    if (!editableRef.current) return;
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(emoji.native));
    sel.removeAllRanges();
    sel.addRange(range);
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!commentHtml.trim() && images.length === 0) return;
    console.log("Comment HTML:", commentHtml, "Rating:", rating, "Images:", images);
    setCommentHtml("");
    setRating(0);
    setImages([]);
  };

  return (
    <div className="w-full max-w-5xl bg-[#f3f7fb] border border-blue-100 rounded-2xl p-4 shadow-sm">
      {/* Star rating */}
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
              className={`cursor-pointer transition-transform duration-150 ${filled ? "text-yellow-400" : "text-gray-300"
                } hover:scale-110`}
            >
              <FaStar className="w-5 h-5" />
            </span>
          );
        })}
        {rating > 0 && <span className="text-sm text-gray-500 ml-2">{rating} / 5</span>}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-2 text-sky-500">
        <button type="button" onClick={() => applyFormat("bold")} title="Bold" className="hover:text-sky-700">
          <FaBold />
        </button>
        <button type="button" onClick={() => applyFormat("italic")} title="Italic" className="hover:text-sky-700">
          <FaItalic />
        </button>
        <button type="button" onClick={() => applyFormat("underline")} title="Underline" className="hover:text-sky-700">
          <FaUnderline />
        </button>

        {/* Emoji */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Emoji"
          className="hover:text-sky-700 relative"
        >
          <FaSmile />
        </button>

        {/* Image */}
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => document.getElementById("image-upload")?.click()}
          title="Upload image"
          className="hover:text-sky-700"
        >
          <FaImage />
        </button>
      </div>

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute mt-2 z-50">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" perLine={9} />
        </div>
      )}

      {/* Rich text editor */}
      <ContentEditable
        innerRef={editableRef}
        html={commentHtml}
        onChange={(e: ContentEditableEvent) => setCommentHtml(e.target.value)}
        className="w-full min-h-[100px] p-2 border border-blue-100 rounded-lg text-gray-700 focus:ring-1 focus:ring-sky-300 bg-white"
      />

      {/* Image preview */}
      {images.length > 0 && (
        <div className="flex gap-2 mt-2 mb-3 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                className="w-20 h-20 object-cover rounded border"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 rounded-full text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!commentHtml.trim() && images.length === 0}
      >
        Gửi
      </button>
    </div>
  );
}
