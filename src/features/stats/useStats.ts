import { useQuery } from "@tanstack/react-query";
import { statsService } from "../../services/statsService";

export function useAdminStats() {
  return useQuery({
    queryKey: ["stats", "admin"],
    queryFn:  () => statsService.getAdminStats(),
    staleTime: 30 * 1000, // refresh every 30 seconds
    refetchInterval: 60 * 1000, // auto-refetch every minute
  });
}