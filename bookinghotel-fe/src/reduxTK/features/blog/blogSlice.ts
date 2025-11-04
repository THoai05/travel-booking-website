import { createSlice } from "@reduxjs/toolkit";
import { createBlog, deletePosts, fetchBlogs, updateBlog } from "./blogThunk";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    pagination: { total: 0, page: 1, limit: 10 },
    isLoading: false,
    error: null as null | unknown,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.data || [];

        const meta = action.payload.meta || {};

        state.pagination = {
          total: meta.total || 0,
          page: meta.page || 1,
          limit: 5,
        };
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((b: any) => b.id === action.payload.id);
        if (index !== -1) state.blogs[index] = action.payload;
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
      });
  },
});

export default blogSlice.reducer;