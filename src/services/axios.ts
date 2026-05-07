import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
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
// Handle 401 globally. If token expires, clear auth and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
api.interceptors.request.use((config) => {
  if (config.url?.includes("/auth/login")) {
    // Cancel the real request and throw a mock response
    const controller = new AbortController();
    config.signal = controller.signal;
    controller.abort(
      JSON.stringify({
        __mock: true,
        token: "mock-jwt-token",
        user: {
          id: "1",
          email: config.data
            ? JSON.parse(config.data).email
            : "admin@campushub.edu",
          fullName:
            config.data && JSON.parse(config.data).role === "admin"
              ? "Admin User"
              : config.data && JSON.parse(config.data).role === "teacher"
                ? "John Doe"
                : "Aarav Sharma",
          role: config.data ? JSON.parse(config.data).role : "student",
        },
      }),
    );
  }
  return config;
});
export default api;
