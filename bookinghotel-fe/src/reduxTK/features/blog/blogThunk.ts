import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axios";

// Lấy danh sách bài viết cho client
export const fetchPublicBlogs = createAsyncThunk(
    "blogs/fetchBlogs",
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/posts?page=${page}&limit=${limit}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Lỗi khi tải danh sách bài viết công khai");
        }
    }
);

//Lấy danh sách bài viết phía admin
export const fetchAdminBlogs = createAsyncThunk(
    "blogs/fetchAdminBlogs",
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/posts/admin?page=${page}&limit=${limit}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Lỗi khi tải danh sách bài viết admin"
            );
        }
    }
);

export const createBlog = createAsyncThunk(
    "blogs/createBlog",
    async (newBlog: any, { rejectWithValue }) => {
        try {
            const res = await api.post("/posts", newBlog);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Lỗi khi tạo bài viết");
        }
    }
);

export const updateBlog = createAsyncThunk(
    "blogs/updateBlog",
    async ({ id, updatedData }: { id: number; updatedData: any }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/posts/${id}`, updatedData, {
                withCredentials: true,
            });
            return res.data.post;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Lỗi khi cập nhật bài viết");
        }
    }
);

export const deletePosts = createAsyncThunk(
    "blogs/deletePosts",
    async (ids: number[], { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `http://localhost:3636/posts`,
                { data: { ids } } // gửi mảng ids qua body
            );
            return ids; // trả về danh sách id đã xóa
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const searchBlogs = createAsyncThunk(
    "blogs/searchBlogs",
    async (keyword: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/posts/search?keyword=${encodeURIComponent(keyword)}`);
            return res.data; // server trả về mảng bài viết đã lọc
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Lỗi khi tìm kiếm bài viết");
        }
    }
);

export const fetchDetailBlogBySlug = createAsyncThunk(
    "blogs/fetchDetailBlogBySlug",
    async (slug: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/posts/slug/${slug}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Lỗi khi tải chi tiết bài viết"
            );
        }
    }
);
