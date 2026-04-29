import api from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
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

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Auth
export const authService = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () => api.get<AuthResponse["user"]>("/auth/me").then((r) => r.data),
};

// Contact form (public endpoint)
export const contactService = {
  send: (data: ContactPayload) =>
    api.post("/contact", data).then((r) => r.data),
};
