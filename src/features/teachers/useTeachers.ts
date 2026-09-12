import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "../../Component/ui/Toast";
import {
  teacherService,
  type CreateTeacherPayload,
  type UpdateTeacherPayload,
} from "../../services/teacherService";

export const teacherKeys = {
  all:    ["teachers"] as const,
  lists:  ["teachers", "list"] as const,
  detail: (id: string) => ["teachers", id] as const,
};

function getErrorMessage(error: unknown) {
  return isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? "Please try again"
    : "Please try again";
}

export function useTeachers() {
  return useQuery({
    queryKey: teacherKeys.lists,
    queryFn:  () => teacherService.getAll(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: (data: CreateTeacherPayload) =>
      teacherService.create(data),
    onSuccess: (t) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists });
      toast.success("Teacher added", `${t.fullName} was added successfully`);
    },
    onError: (error: unknown) => {
      toast.error("Failed", getErrorMessage(error));
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherPayload }) =>
      teacherService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists });
      toast.success("Teacher updated", "Changes saved successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed", getErrorMessage(error));
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: (id: string) => teacherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists });
      toast.success("Teacher deleted", "Record removed successfully");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}
