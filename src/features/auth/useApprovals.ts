import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "../../Component/ui/Toast";
import {
  authService,
  type ApproveUserPayload,
} from "../../services/authService";

const pendingUsersKey = ["auth", "pending-users"] as const;

export function usePendingUsers() {
  return useQuery({
    queryKey: pendingUsersKey,
    queryFn: authService.getPendingUsers,
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveUserPayload }) =>
      authService.approveUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pendingUsersKey });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("User approved", "The account is now active.");
    },
    onError: (error: unknown) => {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "Please try again"
        : "Please try again";
      toast.error("Approval failed", message);
    },
  });
}
