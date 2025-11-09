import { createSlice } from "@reduxjs/toolkit";
import { fetchFavourites, addFavouriteThunk, deleteFavouriteThunk } from "./favouriteThunk";

const initialState = {
  favourites: [] as any[],
  loading: false,
  error: null as string | null,
};

const favouriteSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    resetFavourites(state) {
      state.favourites = [];
    },
  },
  extraReducers: builder => {
    builder
      // fetch
      .addCase(fetchFavourites.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // add
      .addCase(addFavouriteThunk.pending, state => { state.loading = true; state.error = null; })
      .addCase(addFavouriteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites.unshift(action.payload);
      })
      .addCase(addFavouriteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete
      .addCase(deleteFavouriteThunk.pending, state => { state.loading = true; state.error = null; })
      .addCase(deleteFavouriteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = state.favourites.filter(f => f.id !== action.payload.id);
      })
      .addCase(deleteFavouriteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetFavourites } = favouriteSlice.actions;
export default favouriteSlice.reducer;
