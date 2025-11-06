"use client";

import React, { useState } from "react";

interface DetailDescriptionProps {
  title: string;
  content: string;
  city?: { title: string };
}

const DetailDescription = ({ title, content, city }: DetailDescriptionProps) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <section className="px-8 py-6 max-w-5xl mx-auto">
      {/* Breadcrumb / City */}
      <div className="mb-3 text-sm text-gray-500">
        Vietnam /{" "}
        <span className="text-gray-800">{city ? city.title : "Unknown City"}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {/* Content */}
      <p
        className={`text-gray-600 leading-relaxed transition-all duration-300 ${
          !showFull ? "line-clamp-3" : ""
        }`}
      >
        {content}
      </p>

      {/* Read more */}
      {content.split("\n").length > 3 && (
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-blue-600 hover:underline font-medium mt-3 inline-block"
        >
          {showFull ? "Thu gọn" : "Đọc thêm >>"}
        </button>
      )}
    </section>
  );
};

export default DetailDescription;
