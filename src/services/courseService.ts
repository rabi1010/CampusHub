import api from "./axios";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

interface CourseDepartment { id: string; name: string; code: string; }

export interface Course {
  id: string;
  name: string;
  code: string;
  department: CourseDepartment;
  credits: number;
  semester: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface CreateCoursePayload {
  name: string;
  code: string;
  departmentId: string;
  credits: number;
  semester: number;
  description?: string;
}

export interface UpdateCoursePayload {
  name?: string;
  departmentId?: string;
  credits?: number;
  semester?: number;
  description?: string;
}

export const courseService = {
  getAll: (params?: { search?: string; semester?: number; departmentId?: string }) =>
    api
      .get<ApiResponse<SpringPage<Course>>>("/courses", {
        params: { page: 1, size: 100, ...params },
      })
      .then((r) => r.data.data.content),

  getOne: (id: string) =>
    api
      .get<ApiResponse<Course>>(`/courses/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateCoursePayload) =>
    api
      .post<ApiResponse<Course>>("/courses", data)
      .then((r) => r.data.data),

  update: (id: string, data: UpdateCoursePayload) =>
    api
      .put<ApiResponse<Course>>(`/courses/${id}`, data)
      .then((r) => r.data.data),

  delete: (id: string) =>
    api
      .delete<ApiResponse<null>>(`/courses/${id}`)
      .then((r) => r.data),
};