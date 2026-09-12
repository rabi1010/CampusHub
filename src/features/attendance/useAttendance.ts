import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "../../services/attendanceService";

export function useStudentAttendance(studentId?: string) {
  return useQuery({
    queryKey: ["attendance", "student", studentId],
    queryFn: () => attendanceService.getByStudent(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useCourseAttendance(courseId?: string) {
  return useQuery({
    queryKey: ["attendance", "course", courseId],
    queryFn: () => attendanceService.getByCourse(courseId!, { size: 1000 }),
    enabled: Boolean(courseId),
  });
}

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: attendanceService.getSummary,
  });
}
