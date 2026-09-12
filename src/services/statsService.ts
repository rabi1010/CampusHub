import api from "./axios";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalCourses: number;
  totalNotices: number;
  pendingApprovals: number;
  totalPresentRecords: number;
  totalAbsentRecords: number;
}

export const statsService = {
  getAdminStats: () =>
    api
      .get<ApiResponse<AdminStats>>("/stats/admin")
      .then((r) => r.data.data),
};
