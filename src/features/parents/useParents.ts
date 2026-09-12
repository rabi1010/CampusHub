import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "../../Component/ui/Toast";
import {
  parentService,
  type CreateParentPayload,
  type UpdateParentPayload,
} from "../../services/parentService";

export const parentKeys = {
  lists:  ["parents", "list"] as const,
  detail: (id: string) => ["parents", id] as const,
  me: ["parents", "me"] as const,
};

function getErrorMessage(error: unknown) {
  return isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? "Please try again"
    : "Please try again";
}

export function useParents() {
  return useQuery({
    queryKey: parentKeys.lists,
    queryFn:  () => parentService.getAll(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: (data: CreateParentPayload) => parentService.create(data),
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: parentKeys.lists });
      toast.success("Parent added", `${p.fullName} was added successfully`);
    },
    onError: (error: unknown) => {
      toast.error("Failed", getErrorMessage(error));
    },
  });
}

export function useUpdateParent() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParentPayload }) =>
      parentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentKeys.lists });
      toast.success("Parent updated", "Changes saved successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed", getErrorMessage(error));
    },
  });
}

export function useDeleteParent() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: (id: string) => parentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentKeys.lists });
      toast.success("Parent deleted", "Record removed successfully");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}

export function useParentMe() {
  return useQuery({
    queryKey: parentKeys.me,
    queryFn: () => parentService.getMe(),
    staleTime: 2 * 60 * 1000,
  });
}
