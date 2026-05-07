import api from "./axios";

export interface Notice {
  id: string;
  title: string;
  content: string;
  forRole: "ALL" | "TEACHER" | "STUDENT";
  createdBy: string;
  author: string;
  urgent: boolean;
  createdAt: string;
}

export interface CreateNoticePayload {
  title: string;
  content: string;
  forRole: "ALL" | "TEACHER" | "STUDENT";
  urgent: boolean;
}

export const noticeService = {
  getAll: () => api.get<Notice[]>("/notices").then((r) => r.data),

  create: (data: CreateNoticePayload) =>
    api.post<Notice>("/notices", data).then((r) => r.data),

  update: (id: string, data: Partial<CreateNoticePayload>) =>
    api.put<Notice>(`/notices/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/notices/${id}`).then((r) => r.data),
};
