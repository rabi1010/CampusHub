import api from "./axios";

export interface Student {
  id: string;
  fullName: string;
  email: string;
  rollNo: string;
  department: string;
  batch: string;
  phone: string;
  address: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  admissionDate: string;
}

export interface StudentsResponse {
  data: Student[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateStudentPayload {
  fullName: string;
  email: string;
  rollNo: string;
  department: string; // ← was departmentId
  batch: string; // ← was batchId
  phone: string;
  address: string;
  password: string;
}

export const studentService = {
  getAll: (params?: { page?: number; search?: string; status?: string }) =>
    api.get<StudentsResponse>("/students", { params }).then((r) => r.data),

  getOne: (id: string) =>
    api.get<Student>(`/students/${id}`).then((r) => r.data),

  create: (data: CreateStudentPayload) =>
    api.post<Student>("/students", data).then((r) => r.data),

  update: (id: string, data: Partial<CreateStudentPayload>) =>
    api.put<Student>(`/students/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/students/${id}`).then((r) => r.data),
};
