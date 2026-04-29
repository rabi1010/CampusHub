import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // add more slices here as you build: notices, courses, etc.
  },
});

// Infer types from the store itself — never write these manually
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
