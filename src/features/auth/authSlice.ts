import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ── Types ───────────────────────────────────────────────
export type Role = "admin" | "teacher" | "student" | "parent";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ── Rehydrate from localStorage on app load ─────────────
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  token: storedToken ?? null,
  user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
  isAuthenticated: !!storedToken,
};

// ── Slice ───────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Persist to localStorage so page refresh keeps user logged in
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
