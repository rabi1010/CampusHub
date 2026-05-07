import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../Component/ui/Toast";
import type { CreateStudentPayload } from "../../services/studentService";

// ── Mock data ───────────────────────────────────────────
export const MOCK_STUDENTS = [
  {
    id: "1",
    fullName: "Aarav Sharma",
    email: "aarav@college.edu",
    rollNo: "BCA001",
    department: "Computer Science",
    batch: "2023-2026",
    phone: "+977 9800000001",
    address: "Kathmandu",
    status: "ACTIVE" as const,
    admissionDate: "2023-08-01",
  },
  {
    id: "2",
    fullName: "Priya Poudel",
    email: "priya@college.edu",
    rollNo: "BCA002",
    department: "Computer Science",
    batch: "2023-2026",
    phone: "+977 9800000002",
    address: "Lalitpur",
    status: "ACTIVE" as const,
    admissionDate: "2023-08-01",
  },
  {
    id: "3",
    fullName: "Bikash Thapa",
    email: "bikash@college.edu",
    rollNo: "BCA003",
    department: "Information Technology",
    batch: "2023-2026",
    phone: "+977 9800000003",
    address: "Bhaktapur",
    status: "PENDING" as const,
    admissionDate: "2023-08-15",
  },
  {
    id: "4",
    fullName: "Sita Rai",
    email: "sita@college.edu",
    rollNo: "BCA004",
    department: "Computer Science",
    batch: "2022-2025",
    phone: "+977 9800000004",
    address: "Pokhara",
    status: "ACTIVE" as const,
    admissionDate: "2022-08-01",
  },
  {
    id: "5",
    fullName: "Rohan Gurung",
    email: "rohan@college.edu",
    rollNo: "BCA005",
    department: "Electronics",
    batch: "2022-2025",
    phone: "+977 9800000005",
    address: "Chitwan",
    status: "SUSPENDED" as const,
    admissionDate: "2022-08-01",
  },
  {
    id: "6",
    fullName: "Anita Karki",
    email: "anita@college.edu",
    rollNo: "BCA006",
    department: "Information Technology",
    batch: "2024-2027",
    phone: "+977 9800000006",
    address: "Kathmandu",
    status: "ACTIVE" as const,
    admissionDate: "2024-08-01",
  },
  {
    id: "7",
    fullName: "Dipak Shrestha",
    email: "dipak@college.edu",
    rollNo: "BCA007",
    department: "Computer Science",
    batch: "2024-2027",
    phone: "+977 9800000007",
    address: "Lalitpur",
    status: "ACTIVE" as const,
    admissionDate: "2024-08-01",
  },
  {
    id: "8",
    fullName: "Maya Tamang",
    email: "maya@college.edu",
    rollNo: "BCA008",
    department: "Electronics",
    batch: "2023-2026",
    phone: "+977 9800000008",
    address: "Kathmandu",
    status: "PENDING" as const,
    admissionDate: "2023-09-01",
  },
];

// ── Query keys — centralised to avoid typos ─────────────
export const studentKeys = {
  all: ["students"] as const,
  lists: ["students", "list"] as const,
  detail: (id: string) => ["students", id] as const,
};

// ── Fetch all students ───────────────────────────────────
export function useStudents() {
  return useQuery({
    queryKey: studentKeys.lists,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return MOCK_STUDENTS;
      // Replace: return studentService.getAll().then(r => r.data)
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ── Create student ───────────────────────────────────────
export function useCreateStudent() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: CreateStudentPayload) => {
      await new Promise((r) => setTimeout(r, 800));
      return {
        id: Math.random().toString(36).slice(2),
        fullName: data.fullName,
        email: data.email,
        rollNo: data.rollNo,
        department: data.department, // ← was data.departmentId
        batch: data.batch, // ← was data.batchId
        phone: data.phone,
        address: data.address,
        status: "ACTIVE" as const,
        admissionDate: new Date().toISOString(),
      };
    },
    onSuccess: (newStudent) => {
      // Invalidate so list refetches
      queryClient.invalidateQueries({ queryKey: studentKeys.lists });
      toast.success(
        "Student added",
        `${newStudent.fullName} was added successfully`,
      );
    },
    onError: () => {
      toast.error("Failed to add student", "Please try again");
    },
  });
}

// ── Update student ───────────────────────────────────────
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateStudentPayload>;
    }) => {
      await new Promise((r) => setTimeout(r, 800));
      return { id, ...data };
      // Replace: return studentService.update(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists });
      toast.success("Student updated", "Changes saved successfully");
    },
    onError: () => {
      toast.error("Failed to update", "Please try again");
    },
  });
}

// ── Delete student ───────────────────────────────────────
export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 600));
      return id;
      // Replace: return studentService.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists });
      toast.success("Student deleted", "Record removed successfully");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}
