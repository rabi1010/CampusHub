import api from "./axios";

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalNotices: number;
  newStudents: number; // this month
  activeStudents: number;
}

export const statsService = {
  getAdminStats: () => api.get<AdminStats>("/stats/admin").then((r) => r.data),
};
