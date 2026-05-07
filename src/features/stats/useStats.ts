import { useQuery } from "@tanstack/react-query";
import { MOCK_TEACHERS } from "../teachers/useTeachers";

// Mock data — remove when backend is ready
const MOCK_ADMIN_STATS = {
  totalStudents: 124,
  totalTeachers: MOCK_TEACHERS.length,
  totalCourses: 32,
  totalNotices: 9,
  newStudents: 12,
  activeStudents: 118,
};

export function useAdminStats() {
  return useQuery({
    queryKey: ["stats", "admin"],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 600));
      return MOCK_ADMIN_STATS;
      // Replace with real call when backend ready:
      // return statsService.getAdminStats()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
