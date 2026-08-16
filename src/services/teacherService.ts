import api from "./axios";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

interface TeacherUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

interface TeacherDepartment {
  id: string;
  name: string;
  code: string;
}

export interface Teacher {
  id: string;
  user: TeacherUser;
  department: TeacherDepartment;
  employeeId: string;
  qualification: string;
  createdAt: string;
  updatedAt: string;

  // flat aliases — filled by mapTeacher()
  fullName: string;
  email: string;
  phone: string;
  status: string;
}

export function mapTeacher(t: Teacher): Teacher {
  return {
    ...t,
    fullName: t.user?.fullName ?? "",
    email:    t.user?.email    ?? "",
    phone:    t.user?.phone    ?? "",
    status:   t.user?.status   ?? "",
  };
}

export interface CreateTeacherPayload {
  fullName: string;
  email: string;
  password: string;
  employeeId: string;
  departmentId: string;
  qualification?: string;
  phone?: string;
}

export interface UpdateTeacherPayload {
  fullName?: string;
  phone?: string;
  password?: string;
  departmentId?: string;
  qualification?: string;
}

export const teacherService = {
  getAll: (params?: { search?: string; departmentId?: string }) =>
    api
      .get<ApiResponse<SpringPage<Teacher>>>("/teachers", {
        params: { page: 1, size: 100, ...params },
      })
      .then((r) => r.data.data.content.map(mapTeacher)),

  getOne: (id: string) =>
    api
      .get<ApiResponse<Teacher>>(`/teachers/${id}`)
      .then((r) => mapTeacher(r.data.data)),

  create: (data: CreateTeacherPayload) =>
    api
      .post<ApiResponse<Teacher>>("/teachers", data)
      .then((r) => mapTeacher(r.data.data)),

  update: (id: string, data: UpdateTeacherPayload) =>
    api
      .put<ApiResponse<Teacher>>(`/teachers/${id}`, data)
      .then((r) => mapTeacher(r.data.data)),

  delete: (id: string) =>
    api
      .delete<ApiResponse<null>>(`/teachers/${id}`)
      .then((r) => r.data),
};