import api from "./axios";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

interface NoticeCreatedBy {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  forRole: "ALL" | "TEACHER" | "STUDENT" | "PARENT";
  createdBy: NoticeCreatedBy;
  urgent: boolean;
  createdAt: string;
}

export interface CreateNoticePayload {
  title: string;
  content: string;
  forRole: "ALL" | "TEACHER" | "STUDENT" | "PARENT";
  urgent: boolean;
}

export const noticeService = {
  getAll: (params?: { search?: string; page?: number; size?: number }) =>
    api
      .get<ApiResponse<SpringPage<Notice>>>("/notices", {
        params: { page: params?.page ?? 1, size: params?.size ?? 50, ...params },
      })
      .then((r) => r.data.data.content),

  getOne: (id: string) =>
    api
      .get<ApiResponse<Notice>>(`/notices/${id}`)
      .then((r) => r.data.data),

  create: (data: CreateNoticePayload) =>
    api
      .post<ApiResponse<Notice>>("/notices", data)
      .then((r) => r.data.data),

  update: (id: string, data: CreateNoticePayload) =>
    api
      .put<ApiResponse<Notice>>(`/notices/${id}`, data)
      .then((r) => r.data.data),

  delete: (id: string) =>
    api
      .delete<ApiResponse<null>>(`/notices/${id}`)
      .then((r) => r.data),
};
