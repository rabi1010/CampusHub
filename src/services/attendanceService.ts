import api from "./axios";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export interface AttendanceRecord {
  id: string;
  student: {
    id: string;
    rollNo: string;
    user: { fullName: string; email: string };
  };
  course: { id: string; name: string; code: string };
  markedBy: { fullName: string };
  status: "PRESENT" | "ABSENT" | "LATE";
  date: string;
  createdAt: string;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  total: number;
  attendancePercentage: number;
}

export interface MarkAttendancePayload {
  courseId: string;
  date: string;
  records: {
    studentId: string;
    status: "PRESENT" | "ABSENT" | "LATE";
  }[];
}

export const attendanceService = {
  mark: (data: MarkAttendancePayload) =>
    api
      .post<ApiResponse<AttendanceRecord[]>>("/attendance", data)
      .then((r) => r.data.data),

  getByCourse: (courseId: string, params?: { page?: number; size?: number }) =>
    api
      .get<ApiResponse<SpringPage<AttendanceRecord>>>(
        `/attendance/course/${courseId}`,
        { params: { page: params?.page ?? 1, size: params?.size ?? 50 } }
      )
      .then((r) => r.data.data.content),

  getByStudent: (studentId: string, params?: { page?: number; size?: number }) =>
    api
      .get<ApiResponse<SpringPage<AttendanceRecord>>>(
        `/attendance/student/${studentId}`,
        { params: { page: params?.page ?? 1, size: params?.size ?? 50 } }
      )
      .then((r) => r.data.data.content),

  getSummary: (studentId: string) =>
    api
      .get<ApiResponse<AttendanceSummary>>(
        `/attendance/student/${studentId}/summary`
      )
      .then((r) => r.data.data),
};