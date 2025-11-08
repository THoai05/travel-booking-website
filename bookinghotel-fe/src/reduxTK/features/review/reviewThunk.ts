import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axios";

// Lấy danh sách review theo hotelId
export const fetchReviewsByHotel = createAsyncThunk(
  "reviews/fetchByHotel",
  async (
    {
      hotelId,
      page = 1,
      limit = 5,
    }: { hotelId: number; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(
        `/reviews/hotel/${hotelId}?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  }
);

// Tạo review mới
export const createReviewThunk = createAsyncThunk(
  "reviews/createReview",
  async (
    data: {
      hotelId: number;
      rating: number;
      comment: string;
      reviewType?: string;
      images?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/reviews", {
        hotelId: data.hotelId,
        rating: data.rating,
        comment: data.comment,
        reviewType: data.reviewType || "hotel",
        images: data.images || [],
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Create review failed"
      );
    }
  }
);

// Xóa review theo id
export const deleteReviewThunk = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId: number, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      return { id: reviewId, message: res.data?.message || "Deleted" };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Delete review failed"
      );
    }
  }
);
