import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axios";

export const fetchReviewsByHotel = createAsyncThunk(
  "reviews/fetchByHotel",
  async (
    { hotelId, page = 1, limit = 5 }: { hotelId: number; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`/reviews/hotel/${hotelId}?page=${page}&limit=${limit}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  }
);
