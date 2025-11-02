import { createSlice } from "@reduxjs/toolkit";
import { fetchBlogs } from "./blogThunk";

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
      });
  },
});

export default blogSlice.reducer;