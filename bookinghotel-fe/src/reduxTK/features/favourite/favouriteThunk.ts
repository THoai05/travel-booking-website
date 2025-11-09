import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axios";

export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/favourites?userId=${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch favourites");
    }
  }
);

export const addFavouriteThunk = createAsyncThunk(
  "favourites/add",
  async (
    data: { userId: number; hotelId?: number; roomId?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/favourites", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Add favourite failed");
    }
  }
);

export const deleteFavouriteThunk = createAsyncThunk(
  "favourites/delete",
  async (favouriteId: number, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/favourites/${favouriteId}`);
      return { id: favouriteId, message: res.data?.message || "Deleted" };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Delete favourite failed");
    }
  }
);
