import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axios";

// Lấy danh sách bài viết
export const fetchBlogs = createAsyncThunk(
    "blogs/fetchBlogs",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/posts");
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// export const deleteBlog = createAsyncThunk("blog/deleteBlog", async (id) => {...});
// export const createBlog = createAsyncThunk("blog/createBlog", async (formData) => {...});
