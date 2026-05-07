import api from "./axios";

export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  semester: number;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  enrolledCount: number;
}

export interface CreateCoursePayload {
  name: string;
  code: string;
  department: string;
  credits: number;
  semester: number;
  description: string;
}

export const courseService = {
  getAll: () => api.get<Course[]>("/courses").then((r) => r.data),

  getOne: (id: string) => api.get<Course>(`/courses/${id}`).then((r) => r.data),

  create: (data: CreateCoursePayload) =>
    api.post<Course>("/courses", data).then((r) => r.data),

  update: (id: string, data: Partial<CreateCoursePayload>) =>
    api.put<Course>(`/courses/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/courses/${id}`).then((r) => r.data),
};
