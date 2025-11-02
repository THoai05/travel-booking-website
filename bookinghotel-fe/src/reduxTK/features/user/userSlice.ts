import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "./userThunk";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        isLoading: false,
        error: null as null | unknown,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});
export default userSlice.reducer;