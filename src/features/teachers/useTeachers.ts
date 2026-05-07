import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../Component/ui/Toast";
import type { CreateTeacherPayload } from "../../services/teacherService";

// ── Mock data ────────────────────────────────────────────
export const MOCK_TEACHERS = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john@college.edu",
    employeeId: "EMP001",
    department: "Computer Science",
    qualification: "M.Sc Computer Science",
    phone: "+977 9800000010",
    status: "ACTIVE" as const,
    joinedDate: "2020-01-15",
  },
  {
    id: "2",
    fullName: "Sarah Miller",
    email: "sarah@college.edu",
    employeeId: "EMP002",
    department: "Information Technology",
    qualification: "M.Tech IT",
    phone: "+977 9800000011",
    status: "ACTIVE" as const,
    joinedDate: "2019-08-01",
  },
  {
    id: "3",
    fullName: "Raj Thapa",
    email: "raj@college.edu",
    employeeId: "EMP003",
    department: "Electronics",
    qualification: "B.E Electronics",
    phone: "+977 9800000012",
    status: "ACTIVE" as const,
    joinedDate: "2021-03-10",
  },
  {
    id: "4",
    fullName: "Anita Gurung",
    email: "anita.g@college.edu",
    employeeId: "EMP004",
    department: "Computer Science",
    qualification: "Ph.D Computer Science",
    phone: "+977 9800000013",
    status: "ACTIVE" as const,
    joinedDate: "2018-06-01",
  },
  {
    id: "5",
    fullName: "Prakash Shrestha",
    email: "prakash@college.edu",
    employeeId: "EMP005",
    department: "Civil Engineering",
    qualification: "M.E Civil",
    phone: "+977 9800000014",
    status: "PENDING" as const,
    joinedDate: "2024-01-01",
  },
  {
    id: "6",
    fullName: "Sunita Rai",
    email: "sunita@college.edu",
    employeeId: "EMP006",
    department: "Mechanical Engineering",
    qualification: "M.E Mechanical",
    phone: "+977 9800000015",
    status: "ACTIVE" as const,
    joinedDate: "2022-07-15",
  },
];

// ── Query keys ───────────────────────────────────────────
export const teacherKeys = {
  all: ["teachers"] as const,
  lists: ["teachers", "list"] as const,
  detail: (id: string) => ["teachers", id] as const,
};

// ── Fetch all ────────────────────────────────────────────
export function useTeachers() {
  return useQuery({
    queryKey: teacherKeys.lists,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return MOCK_TEACHERS;
      // Replace: return teacherService.getAll()
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ── Create ───────────────────────────────────────────────
export function useCreateTeacher() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: CreateTeacherPayload) => {
      await new Promise((r) => setTimeout(r, 800));
      return {
        id: Math.random().toString(36).slice(2),
        fullName: data.fullName,
        email: data.email,
        employeeId: data.employeeId,
        department: data.department,
        qualification: data.qualification,
        phone: data.phone,
        status: "ACTIVE" as const,
        joinedDate: new Date().toISOString(),
      };
      // Replace: return teacherService.create(data)
    },
    onSuccess: (t) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists });
      toast.success("Teacher added", `${t.fullName} was added successfully`);
    },
    onError: () => {
      toast.error("Failed to add teacher", "Please try again");
    },
  });
}

// ── Update ───────────────────────────────────────────────
export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateTeacherPayload>;
    }) => {
      await new Promise((r) => setTimeout(r, 800));
      return { id, ...data };
      // Replace: return teacherService.update(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists });
      toast.success("Teacher updated", "Changes saved successfully");
    },
    onError: () => {
      toast.error("Failed to update", "Please try again");
    },
  });
}

// ── Delete ───────────────────────────────────────────────
export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 600));
      return id;
      // Replace: return teacherService.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists });
      toast.success("Teacher deleted", "Record removed successfully");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}
