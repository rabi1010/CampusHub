import { useQuery } from "@tanstack/react-query";
import { markService } from "../../services/markService";

export function useStudentMarks(studentId?: string) {
  return useQuery({
    queryKey: ["marks", "student", studentId],
    queryFn: () => markService.getByStudent(studentId!),
    enabled: Boolean(studentId),
  });
}

export function useCourseMarks(courseId?: string) {
  return useQuery({
    queryKey: ["marks", "course", courseId],
    queryFn: () => markService.getByCourse(courseId!),
    enabled: Boolean(courseId),
  });
}

export function useGpa() {
  return useQuery({
    queryKey: ["marks", "gpa"],
    queryFn: markService.getGpa,
  });
}
