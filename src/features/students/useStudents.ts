import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "../../Component/ui/Toast";
import {
  studentService,
  type CreateStudentPayload,
  type UpdateStudentPayload,
} from "../../services/studentService";

export const studentKeys = {
  all:    ["students"] as const,
  lists:  ["students", "list"] as const,
  detail: (id: string) => ["students", id] as const,
};

function getErrorMessage(error: unknown) {
  return isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? "Please try again"
    : "Please try again";
}

// ── Get all students ─────────────────────────────────────
export function useStudents() {
  return useQuery({
    queryKey: studentKeys.lists,
    queryFn:  () => studentService.getAll(),
    staleTime: 2 * 60 * 1000,
  });
}

// ── Create student ───────────────────────────────────────
export function useCreateStudent() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: (data: CreateStudentPayload) =>
      studentService.create(data),

    onSuccess: (newStudent) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists });
      toast.success(
        "Student added",
        `${newStudent.fullName} was enrolled successfully`,
      );
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error("Failed to add student", message);
    },
  });
}

// ── Update student ───────────────────────────────────────
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentPayload }) =>
      studentService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists });
      toast.success("Student updated", "Changes saved successfully");
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error("Failed to update", message);
    },
  });
}

// ── Delete student ───────────────────────────────────────
export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const toast       = useToast();

  return useMutation({
    mutationFn: (id: string) => studentService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists });
      toast.success("Student deleted", "Record removed successfully");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}
