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
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;