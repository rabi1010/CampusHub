import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../Component/ui/Toast";
import type { CreateCoursePayload } from "../../services/courseService";

// ── Mock data ────────────────────────────────────────────
export const MOCK_COURSES = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS101",
    department: "Computer Science",
    credits: 3,
    semester: 1,
    description:
      "Introduction to data structures and algorithms including arrays, linked lists, trees and graphs.",
    status: "ACTIVE" as const,
    enrolledCount: 45,
  },
  {
    id: "2",
    name: "Database Systems",
    code: "CS102",
    department: "Computer Science",
    credits: 3,
    semester: 2,
    description:
      "Fundamentals of database design, SQL, normalization and transaction management.",
    status: "ACTIVE" as const,
    enrolledCount: 38,
  },
  {
    id: "3",
    name: "Web Development",
    code: "IT201",
    department: "Information Technology",
    credits: 4,
    semester: 3,
    description:
      "Modern web development using HTML, CSS, JavaScript and popular frameworks.",
    status: "ACTIVE" as const,
    enrolledCount: 52,
  },
  {
    id: "4",
    name: "Digital Electronics",
    code: "EC101",
    department: "Electronics",
    credits: 3,
    semester: 1,
    description:
      "Basic concepts of digital logic, Boolean algebra and combinational circuits.",
    status: "ACTIVE" as const,
    enrolledCount: 30,
  },
  {
    id: "5",
    name: "Engineering Maths",
    code: "CE101",
    department: "Civil Engineering",
    credits: 4,
    semester: 1,
    description:
      "Applied mathematics for engineering including calculus, matrices and differential equations.",
    status: "ACTIVE" as const,
    enrolledCount: 60,
  },
  {
    id: "6",
    name: "Operating Systems",
    code: "CS301",
    department: "Computer Science",
    credits: 3,
    semester: 3,
    description:
      "Concepts of process management, memory management, file systems and I/O.",
    status: "INACTIVE" as const,
    enrolledCount: 0,
  },
  {
    id: "7",
    name: "Computer Networks",
    code: "CS401",
    department: "Computer Science",
    credits: 3,
    semester: 4,
    description:
      "Network architectures, protocols, TCP/IP, routing and switching fundamentals.",
    status: "ACTIVE" as const,
    enrolledCount: 41,
  },
  {
    id: "8",
    name: "Software Engineering",
    code: "IT301",
    department: "Information Technology",
    credits: 3,
    semester: 4,
    description:
      "Software development lifecycle, design patterns, testing and project management.",
    status: "ACTIVE" as const,
    enrolledCount: 35,
  },
];

// ── Query keys ───────────────────────────────────────────
export const courseKeys = {
  all: ["courses"] as const,
  lists: ["courses", "list"] as const,
  detail: (id: string) => ["courses", id] as const,
};

// ── Fetch all ────────────────────────────────────────────
export function useCourses() {
  return useQuery({
    queryKey: courseKeys.lists,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return MOCK_COURSES;
      // Replace: return courseService.getAll()
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ── Create ───────────────────────────────────────────────
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: CreateCoursePayload) => {
      await new Promise((r) => setTimeout(r, 800));
      return {
        id: Math.random().toString(36).slice(2),
        name: data.name,
        code: data.code,
        department: data.department,
        credits: data.credits,
        semester: data.semester,
        description: data.description,
        status: "ACTIVE" as const,
        enrolledCount: 0,
      };
      // Replace: return courseService.create(data)
    },
    onSuccess: (c) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists });
      toast.success("Course created", `${c.name} was added successfully`);
    },
    onError: () => {
      toast.error("Failed to create course", "Please try again");
    },
  });
}

// ── Update ───────────────────────────────────────────────
export function useUpdateCourse() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateCoursePayload>;
    }) => {
      await new Promise((r) => setTimeout(r, 800));
      return { id, ...data };
      // Replace: return courseService.update(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists });
      toast.success("Course updated", "Changes saved successfully");
    },
    onError: () => {
      toast.error("Failed to update", "Please try again");
    },
  });
}

// ── Delete ───────────────────────────────────────────────
export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 600));
      return id;
      // Replace: return courseService.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists });
      toast.success("Course deleted", "Record removed successfully");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}
