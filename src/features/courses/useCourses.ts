import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "../../Component/ui/Toast";
import {
  courseService,
  type CreateCoursePayload,
  type UpdateCoursePayload,
} from "../../services/courseService";

export const courseKeys = {
  lists: ["courses", "list"] as const,
};

function getErrorMessage(error: unknown) {
  return isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? "Please try again"
    : "Please try again";
}

export function useCourses() {
  return useQuery({
    queryKey: courseKeys.lists,
    queryFn:  () => courseService.getAll(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: (data: CreateCoursePayload) => courseService.create(data),
    onSuccess: (c) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists });
      toast.success("Course added", `${c.name} was added successfully`);
    },
    onError: (error: unknown) => {
      toast.error("Failed", getErrorMessage(error));
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCoursePayload }) =>
      courseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists });
      toast.success("Course updated", "Changes saved successfully");
    },
    onError: (error: unknown) => {
      toast.error("Failed", getErrorMessage(error));
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: (id: string) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists });
      toast.success("Course deleted", "Record removed");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}
