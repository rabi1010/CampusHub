import api from "./axios";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

interface ParentUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  status: string;
}

interface ParentChild {
  id: string;
  rollNo: string;
  user: { fullName: string; email: string };
  department: { name: string };
  batch: { name: string };
}

export interface Parent {
  id: string;
  user: ParentUser;
  children: ParentChild[];
  relationship: string;
  createdAt: string;

  // flat aliases
  fullName: string;
  email: string;
  phone: string;
  status: string;
}

export function mapParent(p: Parent): Parent {
  return {
    ...p,
    fullName: p.user?.fullName ?? "",
    email:    p.user?.email    ?? "",
    phone:    p.user?.phone    ?? "",
    status:   p.user?.status   ?? "",
  };
}

export interface CreateParentPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  relationship?: string;
  studentIds: string[];
}

export interface UpdateParentPayload {
  fullName?: string;
  phone?: string;
  relationship?: string;
  studentIds?: string[];
}

export const parentService = {
  getAll: (params?: { search?: string }) =>
    api
      .get<ApiResponse<SpringPage<Parent>>>("/parents", {
        params,
      })
      .then((r) => r.data.data.content.map(mapParent)),

  getOne: (id: string) =>
    api
      .get<ApiResponse<Parent>>(`/parents/${id}`)
      .then((r) => mapParent(r.data.data)),

  getMe: () =>
    api
      .get<ApiResponse<Parent>>("/parents/me")
      .then((r) => mapParent(r.data.data)),

  create: (data: CreateParentPayload) =>
    api
      .post<ApiResponse<Parent>>("/parents", data)
      .then((r) => mapParent(r.data.data)),

  update: (id: string, data: UpdateParentPayload) =>
    api
      .put<ApiResponse<Parent>>(`/parents/${id}`, data)
      .then((r) => mapParent(r.data.data)),

  delete: (id: string) =>
    api
      .delete<ApiResponse<null>>(`/parents/${id}`)
      .then((r) => r.data),
};
