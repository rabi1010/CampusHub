import axios from "axios";
import { store } from "../app/store";
import { clearCredentials } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ── Request interceptor ─────────────────────────────────
// Attach JWT from localStorage to every request automatically.
// This means you never manually add Authorization headers anywhere.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ────────────────────────────────
// Handle 401 and 403 globally. If token expires or is invalid, clear auth and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      store.dispatch(clearCredentials());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
