import api from "./axios";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

export interface Mark {
  id: string;
  student: {
    id: string;
    rollNo: string;
    user: { fullName: string; email: string };
  };
  course: { id: string; name: string; code: string };
  uploadedBy: { fullName: string };
  examType: "INTERNAL" | "MIDTERM" | "FINAL";
  marksObtained: number;
  totalMarks: number;
  semester: number;
  createdAt: string;
}

export interface UploadMarksPayload {
  courseId: string;
  examType: "INTERNAL" | "MIDTERM" | "FINAL";
  semester: number;
  records: {
    studentId: string;
    marksObtained: number;
    totalMarks: number;
  }[];
}

export const markService = {
  upload: (data: UploadMarksPayload) =>
    api
      .post<ApiResponse<Mark[]>>("/marks", data)
      .then((r) => r.data.data),

  getByStudent: (studentId: string) =>
    api
      .get<ApiResponse<Mark[]>>(`/marks/student/${studentId}`)
      .then((r) => r.data.data),

  getByCourse: (courseId: string) =>
    api
      .get<ApiResponse<Mark[]>>(`/marks/course/${courseId}`)
      .then((r) => r.data.data),

  getGpa: (studentId: string) =>
    api
      .get<ApiResponse<number>>(`/marks/student/${studentId}/gpa`)
      .then((r) => r.data.data),
};