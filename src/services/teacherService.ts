import api from "./axios";

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  qualification: string;
  phone: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  joinedDate: string;
}

export interface CreateTeacherPayload {
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  qualification: string;
  phone: string;
  password: string;
}

export const teacherService = {
  getAll: () => api.get<Teacher[]>("/teachers").then((r) => r.data),

  getOne: (id: string) =>
    api.get<Teacher>(`/teachers/${id}`).then((r) => r.data),

  create: (data: CreateTeacherPayload) =>
    api.post<Teacher>("/teachers", data).then((r) => r.data),

  update: (id: string, data: Partial<CreateTeacherPayload>) =>
    api.put<Teacher>(`/teachers/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/teachers/${id}`).then((r) => r.data),
};
