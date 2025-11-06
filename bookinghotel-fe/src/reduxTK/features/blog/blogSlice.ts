import { createSlice } from "@reduxjs/toolkit";
import { createBlog, deletePosts, fetchAdminBlogs, fetchDetailBlogBySlug, fetchPublicBlogs, fetchRelatedPosts, searchBlogs, updateBlog } from "./blogThunk";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    adminBlogs: [],
    searchResults: [],
    blog: null as null | any,
    related: [] as any[],
    isLoading: false,
    isRelatedLoading: false,
    pagination: { total: 0, page: 1, limit: 10 },
    adminPagination: { total: 0, page: 1, limit: 5 },
    error: null as null | unknown,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch Blogs
      .addCase(fetchPublicBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.data || [];

        const meta = action.payload.meta || {};

        state.pagination = {
          total: meta.total || 0,
          page: meta.page || 1,
          limit: 5,
        };
      })
      .addCase(fetchPublicBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Admin Blogs
      .addCase(fetchAdminBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        // console.log("Admin blogs loaded:", action.payload);
        state.isLoading = false;
        state.adminBlogs = action.payload.data || [];

        const meta = action.payload.meta || {};

        state.adminPagination = {
          total: meta.total || 0,
          page: meta.page || 1,
          limit: 5,
        };
      })
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedPost = action.payload;
        const index = state.blogs.findIndex((b: any) => b.id === updatedPost.id);
        if (index !== -1) {
          state.blogs[index] = updatedPost;
        }
      })

      // DELETE
      .addCase(deletePosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const idsDeleted = action.payload;
        state.blogs = state.blogs.filter((b) => !idsDeleted.includes(b.id));
      })
      .addCase(deletePosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Search Blogs
      .addCase(searchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.searchResults = [];
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //Fetch post by slug
      .addCase(fetchDetailBlogBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDetailBlogBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blog = action.payload;
      })
      .addCase(fetchDetailBlogBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ? String(action.payload) : "Có lỗi xảy ra";
      })

      // // Fetch related posts
      .addCase(fetchRelatedPosts.pending, (state) => {
        state.isRelatedLoading = true;
        state.error = null;
      })
      .addCase(fetchRelatedPosts.fulfilled, (state, action) => {
        state.isRelatedLoading = false;
        state.related = action.payload;
      })
      .addCase(fetchRelatedPosts.rejected, (state, action) => {
        state.isRelatedLoading = false;
        state.error = action.payload;
      })
  },
});

export default blogSlice.reducer;