import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "../../services/attendanceService";

export function useStudentAttendance(studentId?: string) {
  return useQuery({
    queryKey: ["attendance", "student", studentId],
    queryFn: () => attendanceService.getByStudent(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: attendanceService.getSummary,
  });
}
