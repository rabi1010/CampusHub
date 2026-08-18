import api from "./axios";

// ── Types matching your Java backend response ──────────
export interface StudentUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDepartment {
  id: string;
  name: string;
  code: string;
}

export interface StudentBatch {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  user: StudentUser;
  department: StudentDepartment;
  batch: StudentBatch;
  rollNo: string;
  address: string;
  admissionDate: string;
  updatedAt: string;

  // Flat aliases for DataTable columns
  // These are computed when mapping API response
  fullName: string;
  email: string;
  status: string;
  phone: string;
}

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateStudentPayload {
  fullName: string;
  email: string;
  password: string;
  rollNo: string;
  departmentId: string;
  batchId: string;
  phone?: string;
  address?: string;
}

export interface UpdateStudentPayload {
  fullName?: string;
  phone?: string;
  password?: string;
  departmentId?: string;
  batchId?: string;
  address?: string;
}

// ── Helper — flatten nested API response for DataTable ──
// Your DataTable expects flat fields like student.fullName
// But API returns student.user.fullName
// This maps nested → flat so existing column definitions work
export function mapStudent(s: Student): Student {
  return {
    ...s,
    fullName: s.user?.fullName ?? "",
    email:    s.user?.email    ?? "",
    status:   s.user?.status   ?? "",
    phone:    s.user?.phone    ?? "",
  };
}

export const studentService = {

  // GET /api/students, with optional filters when explicitly requested.
  getAll: (params?: {
    page?: number;
    size?: number;
    search?: string;
    departmentId?: string;
  }) =>
    api
      .get<ApiResponse<SpringPage<Student>>>("/students", {
        params,
      })
      .then((r) => r.data.data.content.map(mapStudent)),

  getOne: (id: string) =>
    api
      .get<ApiResponse<Student>>(`/students/${id}`)
      .then((r) => mapStudent(r.data.data)),

  create: (data: CreateStudentPayload) =>
    api
      .post<ApiResponse<Student>>("/students", data)
      .then((r) => mapStudent(r.data.data)),

  update: (id: string, data: UpdateStudentPayload) =>
    api
      .put<ApiResponse<Student>>(`/students/${id}`, data)
      .then((r) => mapStudent(r.data.data)),

  delete: (id: string) =>
    api
      .delete<ApiResponse<null>>(`/students/${id}`)
      .then((r) => r.data),

  uploadImage: (id: string, file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api
      .post<ApiResponse<null>>(`/students/${id}/image`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  getImage: (id: string) =>
    `${api.defaults.baseURL}/students/${id}/image`,
};
