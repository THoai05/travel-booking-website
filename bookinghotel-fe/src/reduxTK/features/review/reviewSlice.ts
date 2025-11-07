import { createSlice } from "@reduxjs/toolkit";
import { fetchReviewsByHotel } from "./reviewThunk";

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    total: 0,
    page: 1,
    limit: 5,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    resetReviews(state) {
      state.reviews = [];
      state.page = 1;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByHotel.fulfilled, (state, action) => {
        state.loading = false;
        const { data, total, page, limit } = action.payload;
        // Nếu page = 1 thì reset, nếu page > 1 thì nối thêm
        if (page === 1) state.reviews = data;
        else state.reviews = [...state.reviews, ...data];
        state.total = total;
        state.page = page;
        state.limit = limit;
      })
      .addCase(fetchReviewsByHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
