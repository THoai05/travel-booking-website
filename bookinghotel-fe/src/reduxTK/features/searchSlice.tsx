import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addDays } from 'date-fns'
import type { RootState } from '../store' // Import RootState

// 1. Định nghĩa "hình dạng" (interface) của state
interface GuestsState {
  adults: number
  children: number
  rooms: number
}

interface SearchState {
  destination: string
  checkIn: string // Lưu
  checkOut: string // Lưu
  guests: GuestsState
}

// 2. Tạo state ban đầu
// Lấy ngày hôm nay và ngày mai làm mặc định
const today = new Date()
const tomorrow = addDays(today, 1)

const initialState: SearchState = {
  // Bro có thể đặt default 'Da Nang' như trong HotelSearchBar
  destination: 'Da Nang',
  // Luôn lưu trữ date dưới dạng ISO string (serializable)
  checkIn: today.toISOString(),
  checkOut: tomorrow.toISOString(),
  guests: {
    adults: 2,
    children: 0,
    rooms: 1,
  },
}

// 3. Tạo Slice
export const searchSlice = createSlice({
  name: 'search',
  initialState,
  // Reducers là các "hàm" để thay đổi state
  reducers: {
    // Action cho destination
    setDestination: (state, action: PayloadAction<string>) => {
      state.destination = action.payload
    },

    // Action cho HeroSearch (chọn 1 ngày)
    setCheckIn: (state, action: PayloadAction<string>) => {
      state.checkIn = action.payload
      // Tự động đảm bảo checkOut luôn sau checkIn
      if (new Date(state.checkOut) <= new Date(action.payload)) {
        state.checkOut = addDays(new Date(action.payload), 1).toISOString()
      }
    },

    // Action cho HeroSearch (cập nhật checkOut từ duration)
    setCheckOut: (state, action: PayloadAction<string>) => {
      state.checkOut = action.payload
    },

    // Action cho HotelSearchBar (chọn 1 khoảng - range)
    setDates: (
      state,
      action: PayloadAction<{ checkIn: string; checkOut: string }>,
    ) => {
      state.checkIn = action.payload.checkIn
      state.checkOut = action.payload.checkOut
    },

    // Action chung để cập nhật guests
    setGuests: (state, action: PayloadAction<Partial<GuestsState>>) => {
      // Dùng Partial để có thể update 1, 2, hoặc cả 3 giá trị
      state.guests = { ...state.guests, ...action.payload }
    },
  },
})

// 4. Export các actions để component có thể gọi
export const { setDestination, setCheckIn, setCheckOut, setDates, setGuests } =
  searchSlice.actions

// 5. Export các selectors (hàm để lấy state)
export const selectSearch = (state: RootState) => state.search
export const selectGuests = (state: RootState) => state.search.guests

// 6. Export reducer để thêm vào store
export default searchSlice.reducer