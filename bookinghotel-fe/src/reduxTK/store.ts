import { configureStore, combineReducers } from '@reduxjs/toolkit'
import searchReducer from './features/searchSlice'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // <-- Mặc định là localStorage
import blogReducer from './features/blog/blogSlice'

// --- Tạo root reducer ---
const rootReducer = combineReducers({
  search: searchReducer,
  blogs: blogReducer,
})

// --- 4. Cấu hình persist ---
const persistConfig = {
  key: 'root', // Key cho localStorage
  version: 1,
  storage, // Dùng localStorage
  whitelist: ['search'], // QUAN TRỌNG: Chỉ lưu 'search' slice.
  // Bro không nên lưu mọi thứ, ví dụ state 'isLoading'
}

// --- 5. Tạo persisted reducer ---
const persistedReducer = persistReducer(persistConfig, rootReducer)

// --- 6. Cấu hình store ---
export const store = configureStore({
  reducer: persistedReducer, // <-- Dùng persistedReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Tắt check này vì redux-persist
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// --- 7. Export persistor ---
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch