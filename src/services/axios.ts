import axios from "axios";
import { store } from "../app/store";
import { clearCredentials } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
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
  // The instance default is JSON, but multipart requests must let the
  // browser add the boundary and Content-Type header.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// ── Response interceptor ────────────────────────────────
// Only 401 means the session is invalid. A 403 is a valid user without permission
// and must not destroy their authenticated session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.endsWith("/auth/login");
    const isImageRequest = error.config?.url?.includes("/image");
    // Clear an invalid token immediately so subsequent requests cannot keep
    // reusing it. Image requests stay on the current page; their form shows
    // the session message instead of forcing a full-page navigation.
    if (error.response?.status === 401 && !isLoginRequest) {
      store.dispatch(clearCredentials());
      if (!isImageRequest) window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
