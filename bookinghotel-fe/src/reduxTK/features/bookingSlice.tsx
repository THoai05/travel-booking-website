import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
// Giả sử bro có 1 file api service
// import { bookingApi } from '@/service/booking/bookingService' 

// 1. Định nghĩa "hình dạng" của data booking
// Dùng y hệt cái 'data' mà backend trả về
export interface PendingBooking {
  bookingId: number
  userId: number
  roomTypeId: number
  checkinDate: string
  checkoutDate: string
  guestsCount: number
  bedType: string
  roomName: string
  totalPrice: number
  // Bro có thể thêm status và expiresAt vào đây nếu BE trả về
  status?: string 
}

// 2. Định nghĩa "hình dạng" của state
interface BookingState {
  pendingBooking: PendingBooking | null // Đây là nơi lưu data
  isLoading: boolean
  error: string | null
}

const initialState: BookingState = {
  pendingBooking: null,
  isLoading: false,
  error: null,
}

// 3. Tạo Async Thunk (để "hỏi lại" khi F5)
// export const fetchBookingById = createAsyncThunk(
//   'booking/fetchById',
//   async (bookingId: number, { rejectWithValue }) => {
//     try {
//       // Gọi API GET /api/bookings/{bookingId}
//       const response = await bookingApi.getBookingDetails(bookingId) 
//       return response.data as PendingBooking
//     } catch (err: any) {
//       return rejectWithValue(err.response.data.message || 'Failed to fetch booking')
//     }
//   }
// )

// 4. Tạo Slice
export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  // Reducers đồng bộ
  reducers: {
    // Action này được gọi ngay khi API tạo booking thành công
    setPendingBooking: (state, action: PayloadAction<PendingBooking>) => {
      state.pendingBooking = action.payload
      state.isLoading = false
      state.error = null
    },
    // Action để xóa/hủy booking (khi checkout xong hoặc user hủy)
    clearPendingBooking: (state) => {
      state.pendingBooking = null
    },
  },
  // Reducers bất đồng bộ (cho thunk)
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchBookingById.pending, (state) => {
  //       state.isLoading = true
  //       state.error = null
  //     })
  //     .addCase(fetchBookingById.fulfilled, (state, action: PayloadDAction<PendingBooking>) => {
  //       state.isLoading = false
  //       state.pendingBooking = action.payload // Nạp data vào Redux
  //     })
  //     .addCase(fetchBookingById.rejected, (state, action) => {
  //       state.isLoading = false
  //       state.error = action.payload as string
  //     })
  // },
})

// 5. Export actions và selectors
export const { setPendingBooking, clearPendingBooking } = bookingSlice.actions

export const selectBooking = (state: RootState) => state.booking

export default bookingSlice.reducer