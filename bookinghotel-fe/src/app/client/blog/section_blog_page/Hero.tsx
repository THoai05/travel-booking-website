"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchBlogs } from "@/reduxTK/features/blog/blogThunk";
import { AppDispatch, RootState } from "@/reduxTK/store";
import styles from "../css/Blog.module.css";
import { useRouter } from "next/navigation";

let debounceTimer: NodeJS.Timeout;

const Hero = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchResults = useSelector((state: RootState) => state.blogs.searchResults);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    if (keyword.trim() === "") return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      dispatch(searchBlogs(keyword));
    }, 500); // debounce 500ms
  }, [keyword, dispatch]);

  return (
    <section className={`${styles.bg_blog} w-full h-[921px] flex flex-col items-center justify-center`}>
      <div className="flex items-center gap-3 px-6 py-4 rounded-full shadow-lg 
             bg-white/5 backdrop-blur-md border border-white/20 
             hover:bg-white/20 transition-all duration-300 w-[800px]">
        <div className="w-9 h-9 flex items-center justify-center bg-sky-500 text-white rounded-full 
                    hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search city here..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="outline-none text-white placeholder:text-gray-200 
          bg-transparent w-full"
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4 w-[800px] bg-white/90 backdrop-blur-md rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {searchResults.map((post: any) => (
            <div
              key={post.id}
              onClick={() => router.push(`/blog/${post.slug}`)}
              className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-semibold">{post.title}</p>
              <p className="text-sm text-gray-600">{post.city?.title}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
