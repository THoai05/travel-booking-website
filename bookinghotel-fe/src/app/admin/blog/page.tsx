import Image from 'next/image';
import React from 'react'

const Blog = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-start mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <p className=" ml-10 text-sm text-gray-500">/ Blog / Details</p>
      </div>

      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Featured Post (Left) */}
        <div className="flex-1 relative rounded-xl overflow-hidden shadow-md max-h-[350px]">
          <Image
            src="/post1.png"
            alt="featured"
            width={800}
            height={500}
            className="object-cover w-full h-[350px]"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5
          text-white h-full">
            <h2 className="text-lg font-semibold mb-2">Tên bài viết</h2>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>👤 Quân Đặng</span>
              <span>💬 598 Comments</span>
              <span>👁 02 Hits</span>
            </div>
            <p className="text-xs mt-2">25 July 2024</p>
          </div>
        </div>

        {/* Side Posts (Right) */}
        <div className="flex-1 flex flex-col gap-4 justify-between h-[500px]">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition flex-1"
            >
              <div className="flex gap-3 p-3 h-full mt-7">
                <Image
                  src="/post3.png"
                  alt="small post"
                  width={100}
                  height={100}
                  className="object-cover w-35 h-35 rounded-md self-start border border-black"
                />
                <div className="flex-1 flex flex-col justify-start">
                  <p className="text-sm text-gray-500">{i + 1} January 2025</p>
                  <h3 className="text-base font-semibold text-gray-900">
                    Tên bài post
                  </h3>
                  <p className="text-xs text-gray-500">by: Admin | 0 Hits</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    There are many variations of passages of Lorem Ipsum available...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="flex"> </div>
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
};

export default Blog