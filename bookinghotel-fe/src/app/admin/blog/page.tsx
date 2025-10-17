"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const posts = [
  {
    id: 1,
    title: "Cách viết Blog chuẩn SEO",
    author: "Quân Đặng",
    date: "25 July 2024",
    comments: 598,
    hits: 2,
    image: "/post1.png",
  },
  {
    id: 2,
    title: "Làm sao để tăng traffic tự nhiên",
    author: "Admin",
    date: "1 January 2025",
    comments: 120,
    hits: 15,
    image: "/post3.png",
  },
  {
    id: 3,
    title: "Các bước tạo nội dung hấp dẫn",
    author: "Admin",
    date: "2 January 2025",
    comments: 76,
    hits: 8,
    image: "/post3.png",
  },
];

export default function Blog() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-start mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <p className="ml-10 text-sm text-gray-500">/ Blog / Details</p>
      </div>

      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Featured Post (Left) */}
        <Link
          href={`/admin/blog/details/${posts[0].id}`}
          className="flex-1 relative rounded-xl overflow-hidden shadow-md max-h-[350px] group"
        >
          <Image
            src={posts[0].image}
            alt="featured"
            width={800}
            height={500}
            className="object-cover w-full h-[350px] transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5 text-white h-full group-hover:bg-black/40 transition">
            <h2 className="text-lg font-semibold mb-2">{posts[0].title}</h2>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>👤 {posts[0].author}</span>
              <span>💬 {posts[0].comments} Comments</span>
              <span>👁 {posts[0].hits} Hits</span>
            </div>
            <p className="text-xs mt-2">{posts[0].date}</p>
          </div>
        </Link>

        {/* Side Posts (Right) */}
        <div className="flex-1 flex flex-col gap-4 justify-between h-[500px]">
          {posts.slice(1, 3).map((post) => (
            <Link
              key={post.id}
              href={`/admin/blog/details/${post.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition flex-1"
            >
              <div className="flex gap-3 p-3 h-full mt-7">
                <Image
                  src={post.image}
                  alt="small post"
                  width={100}
                  height={100}
                  className="object-cover w-35 h-35 rounded-md self-start border border-black"
                />
                <div className="flex-1 flex flex-col justify-start">
                  <p className="text-sm text-gray-500">{post.date}</p>
                  <h3 className="text-base font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    by: {post.author} | {post.hits} Hits
                  </p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    There are many variations of passages of Lorem Ipsum available...
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* See more */}
      <div className="text-right pb-2">
        <button className="text-sm text-blue-600 hover:underline">
          See more &gt;&gt;
        </button>
      </div>

      {/* Grid of Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <Image
              src="/post4.png"
              alt="post"
              width={300}
              height={200}
              className="object-cover w-full h-[180px]"
            />
            <div className="p-4">
              <p className="text-xs text-gray-500">
                9 April 2024 | by: Admin | 0 Hits
              </p>
              <h4 className="text-sm font-semibold text-gray-900 mt-2">
                Tên bài viết
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
