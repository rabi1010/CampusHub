import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Bell,
  Settings,
  ClipboardList,
  BarChart3,
  UserCheck,
  FileText,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number; // notification count
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

// ── Admin navigation ────────────────────────────────────
export const ADMIN_NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard/admin", icon: LayoutDashboard },
    ],
  },
  {
    group: "Management",
    items: [
      { label: "Students", to: "/admin/students", icon: GraduationCap },
      { label: "Teachers", to: "/admin/teachers", icon: Users },
      { label: "Courses", to: "/admin/courses", icon: BookOpen },
    ],
  },
  {
    group: "Communication",
    items: [{ label: "Notices", to: "/admin/notices", icon: Bell }],
  },
  {
    group: "System",
    items: [{ label: "Settings", to: "/admin/settings", icon: Settings }],
  },
];

// ── Teacher navigation ──────────────────────────────────
export const TEACHER_NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard/teacher", icon: LayoutDashboard },
    ],
  },
  {
    group: "Classes",
    items: [
      { label: "Students", to: "/teacher/students", icon: GraduationCap },
      { label: "Attendance", to: "/teacher/attendance", icon: UserCheck },
      { label: "Marks", to: "/teacher/marks", icon: BarChart3 },
    ],
  },
  {
    group: "Communication",
    items: [{ label: "Notices", to: "/teacher/notices", icon: Bell }],
  },
];

// ── Student navigation ──────────────────────────────────
export const STUDENT_NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard/student", icon: LayoutDashboard },
    ],
  },
  {
    group: "Academic",
    items: [
      { label: "My Courses", to: "/student/courses", icon: BookOpen },
      { label: "My Profile", to: "/student/profile", icon: Users },
    ],
  },
  {
    group: "Updates",
    items: [{ label: "Notices", to: "/student/notices", icon: Bell }],
  },
];

// ── Role to nav map ─────────────────────────────────────
export const NAV_BY_ROLE = {
  admin: ADMIN_NAV,
  teacher: TEACHER_NAV,
  student: STUDENT_NAV,
} as const;
