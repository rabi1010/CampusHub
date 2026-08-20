import api from "./axios";
// Add this interface at the top with the others
export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  role: "teacher" | "student" | "parent";
  password: string;
}
export type RegisterRequest = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "TEACHER" | "STUDENT" | "PARENT";
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
}
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
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

export interface PendingUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "STUDENT" | "TEACHER" | "PARENT" | "PENDING";
  status: "PENDING";
  createdAt: string;
}

export type ApproveUserPayload =
  | { role: "STUDENT"; rollNo: string; departmentId: string; batchId: string; address?: string }
  | { role: "TEACHER"; employeeId: string; departmentId: string; qualification: string }
  | { role: "PARENT"; studentIds: string[]; relationship: string };

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
  getPendingUsers: () =>
    api
      .get<ApiResponse<PendingUser[]>>("/auth/users/pending")
      .then((r) => r.data.data),
  approveUser: (id: string, data: ApproveUserPayload) =>
    api
      .patch<ApiResponse<PendingUser>>(`/auth/users/${id}/approve`, data)
      .then((r) => r.data.data),
};

// Contact form (public endpoint)
export const contactService = {
  send: (data: ContactPayload) =>
    api.post("/contact", data).then((r) => r.data),
};
