import { useQuery } from "@tanstack/react-query";
import { academicsService } from "../../services/academicsService";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn:  () => academicsService.getDepartments(),
    staleTime: 10 * 60 * 1000, // departments rarely change
  });
}

export function useBatches() {
  return useQuery({
    queryKey: ["batches"],
    queryFn:  () => academicsService.getBatches(),
    staleTime: 10 * 60 * 1000,
  });
}