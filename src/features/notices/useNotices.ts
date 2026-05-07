import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppSelector } from "../../app/hooks";
import { useToast } from "../../Component/ui/Toast";
import type { CreateNoticePayload } from "../../services/noticeService";

// ── Mock data ────────────────────────────────────────────
export const MOCK_NOTICES = [
  {
    id: "1",
    title: "Annual Sports Week",
    content:
      "The annual sports week will be held from May 20-25. All students are encouraged to participate in various sports activities. Registration is open at the sports department.",
    forRole: "ALL" as const,
    createdBy: "1",
    author: "Admin User",
    urgent: true,
    createdAt: "2024-05-10T08:00:00Z",
  },
  {
    id: "2",
    title: "CS101 Exam Schedule",
    content:
      "The midterm examination for CS101 Data Structures will be held on May 18th at 10:00 AM in Hall A. Students must bring their admit cards.",
    forRole: "STUDENT" as const,
    createdBy: "1",
    author: "Admin User",
    urgent: false,
    createdAt: "2024-05-10T09:00:00Z",
  },
  {
    id: "3",
    title: "Holiday Notice",
    content:
      "The college will remain closed on May 15th on account of the national holiday. Classes will resume normally on May 16th.",
    forRole: "ALL" as const,
    createdBy: "1",
    author: "Admin User",
    urgent: false,
    createdAt: "2024-05-09T10:00:00Z",
  },
  {
    id: "4",
    title: "Staff Meeting",
    content:
      "All teaching staff are required to attend the monthly staff meeting on May 17th at 2:00 PM in the conference room. Attendance is mandatory.",
    forRole: "TEACHER" as const,
    createdBy: "1",
    author: "Admin User",
    urgent: true,
    createdAt: "2024-05-08T11:00:00Z",
  },
  {
    id: "5",
    title: "Semester Break Announcement",
    content:
      "The semester break will begin from June 1st and classes will resume on July 15th. Students are advised to plan accordingly.",
    forRole: "ALL" as const,
    createdBy: "1",
    author: "Admin User",
    urgent: false,
    createdAt: "2024-05-07T09:00:00Z",
  },
  {
    id: "6",
    title: "Workshop on AI",
    content:
      "A two-day workshop on Artificial Intelligence and Machine Learning will be conducted on May 22-23. Interested students can register at the IT department.",
    forRole: "STUDENT" as const,
    createdBy: "1",
    author: "Admin User",
    urgent: false,
    createdAt: "2024-05-06T14:00:00Z",
  },
];

// ── Query keys ───────────────────────────────────────────
export const noticeKeys = {
  all: ["notices"] as const,
  lists: ["notices", "list"] as const,
};

// ── Fetch all ─────────────────────────────────────────────
export function useNotices() {
  return useQuery({
    queryKey: noticeKeys.lists,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return MOCK_NOTICES;
      // Replace: return noticeService.getAll()
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ── Fetch notices filtered by current user role ───────────
// Students see ALL + STUDENT notices
// Teachers see ALL + TEACHER notices
// Admin sees everything
export function useMyNotices() {
  const role = useAppSelector((s) => s.auth.user?.role);

  return useQuery({
    queryKey: [...noticeKeys.lists, role],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return MOCK_NOTICES.filter((n) => {
        if (role === "admin") return true;
        if (role === "teacher")
          return n.forRole === "ALL" || n.forRole === "TEACHER";
        if (role === "student")
          return n.forRole === "ALL" || n.forRole === "STUDENT";
        return false;
      });
      // Replace: return noticeService.getAll()
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ── Create ────────────────────────────────────────────────
export function useCreateNotice() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const user = useAppSelector((s) => s.auth.user);

  return useMutation({
    mutationFn: async (data: CreateNoticePayload) => {
      await new Promise((r) => setTimeout(r, 800));
      return {
        id: Math.random().toString(36).slice(2),
        title: data.title,
        content: data.content,
        forRole: data.forRole,
        urgent: data.urgent,
        createdBy: user?.id ?? "1",
        author: user?.fullName ?? "Admin",
        createdAt: new Date().toISOString(),
      };
      // Replace: return noticeService.create(data)
    },
    onSuccess: (n) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists });
      toast.success("Notice posted", `"${n.title}" is now live`);
    },
    onError: () => {
      toast.error("Failed to post notice", "Please try again");
    },
  });
}

// ── Update ────────────────────────────────────────────────
export function useUpdateNotice() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateNoticePayload>;
    }) => {
      await new Promise((r) => setTimeout(r, 800));
      return { id, ...data };
      // Replace: return noticeService.update(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists });
      toast.success("Notice updated", "Changes saved successfully");
    },
    onError: () => {
      toast.error("Failed to update", "Please try again");
    },
  });
}

// ── Delete ────────────────────────────────────────────────
export function useDeleteNotice() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 600));
      return id;
      // Replace: return noticeService.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists });
      toast.success("Notice deleted", "Notice removed successfully");
    },
    onError: () => {
      toast.error("Failed to delete", "Please try again");
    },
  });
}
