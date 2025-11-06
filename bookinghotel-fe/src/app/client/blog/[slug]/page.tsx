"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reduxTK/store";
import { fetchDetailBlogBySlug } from "@/reduxTK/features/blog/blogThunk";
import DetailDescription from "./DetailDescription";
import Gallery from "./Gallery";
import InspirationStories from "./InspirationStories";
import TravelTipsSection from "./TravelTipsSection";

export default function DetailBlog({ params }: { params: { slug: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) => state.blogs.blog);
  const isLoading = useSelector((state: RootState) => state.blogs.isLoading);

  useEffect(() => {
    if (params.slug) {
      dispatch(fetchDetailBlogBySlug(params.slug));
    }
  }, [params.slug, dispatch]);

  // Log debug khi post cập nhật
  useEffect(() => {
    if (post) {
      console.log("=== Post Loaded ===");
      console.log("Title:", post.title);
      console.log("Images:", post.images);
      console.log("Content:", post.content);
      console.log("Author:", post.author);
      console.log("City:", post.city);
    }
  }, [post]);

  if (isLoading) return <p>Loading...</p>;
  if (!post) return <p>Không tìm thấy bài viết.</p>;

  return (
    <section className="w-full mx-auto py-16">
      {/* <h1 className="text-3xl font-bold mb-6 capitalize">{post.title}</h1> */}

      <Gallery images={post.images} />
      <DetailDescription
        title={post.title}
        content={post.content}
        city={post.city}
      />
      <InspirationStories author={post.author} />

      <div className="w-full bg-[#1C2930]">
        <TravelTipsSection />
      </div>
    </section>
  );
}
