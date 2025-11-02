import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axios";

// Lấy danh sách bài viết
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (
    { page = 1, limit = 5 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`/posts?page=${page}&limit=${limit}`);
      return res.data; // backend trả { data, totalPages, currentPage, ... }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tải danh sách bài viết");
    }
  }
);

// export const deleteBlog = createAsyncThunk("blog/deleteBlog", async (id) => {...});
// export const createBlog = createAsyncThunk("blog/createBlog", async (formData) => {...});
