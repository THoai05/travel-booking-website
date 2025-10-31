"use client";
import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./slices/postSlice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
  },
});

// types cho useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
