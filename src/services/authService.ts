import api from "./axios";
// Add this interface at the top with the others
export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  role: "teacher" | "student";
  password: string;
}
export type RegisterRequest = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "TEACHER" | "STUDENT";
};
export interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface LoginPayload {
  email: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "admin" | "teacher" | "student";
  };
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Auth
export const authService = {
  login: (data: LoginPayload) =>
    api
      .post<ApiResponse<AuthResponse>>("/auth/login", data)
      .then((r) => r.data.data),

  register: (data: RegisterPayload) =>
    api
      .post<ApiResponse<RegisterResponse>>("/auth/register", {
        ...data,
        role: data.role.toUpperCase() as RegisterRequest["role"],
      })
      .then((r) => r.data.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () => api.get("/auth/me").then((r) => r.data),
};

// Contact form (public endpoint)
export const contactService = {
  send: (data: ContactPayload) =>
    api.post("/contact", data).then((r) => r.data),
};
