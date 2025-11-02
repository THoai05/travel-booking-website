import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/axios";

// Lấy danh sách người dùng
export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  const res = await api.get("/users");
  return res.data;
});