import api from "./axios";
// Add this interface at the top with the others
export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  role: "teacher" | "student";
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "teacher" | "student";
    status: "pending"; // always pending until admin approves
  };
}
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
