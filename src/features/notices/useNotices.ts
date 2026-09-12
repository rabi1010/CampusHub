import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "../../Component/ui/Toast";
import {
  noticeService,
  type CreateNoticePayload,
} from "../../services/noticeService";

export const noticeKeys = {
  lists: ["notices", "list"] as const,
};

function getErrorMessage(error: unknown) {
  return isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? "Please try again"
    : "Please try again";
}

export function useNotices() {
  return useQuery({
    queryKey: noticeKeys.lists,
    queryFn: () => noticeService.getAll(),
    staleTime: 1 * 60 * 1000,
  });
}

export function useMyNotices() {
  return useNotices();
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CreateNoticePayload) => noticeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists });
      toast.success("Notice posted", "Notice is now visible to target audience");
    },
    onError: (error: unknown) => {
      toast.error("Failed", getErrorMessage(error));
    },
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => noticeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists });
      toast.success("Notice deleted", "Removed successfully");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}
