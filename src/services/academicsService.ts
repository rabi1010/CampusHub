import api from "./axios";

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Batch {
  id: string;
  name: string;
  department: { id: string; name: string };
  startYear: number;
  endYear: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const academicsService = {
  getDepartments: () =>
    api
      .get<ApiResponse<Department[]>>("/departments")
      .then((r) => r.data.data),

  getBatches: () =>
    api
      .get<ApiResponse<Batch[]>>("/batches")
      .then((r) => r.data.data),
};