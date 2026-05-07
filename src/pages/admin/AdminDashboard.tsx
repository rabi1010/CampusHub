import { useMemo } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Bell,
  TrendingUp,
  UserCheck,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAdminStats } from "../../features/stats/useStats";
import { useStudents } from "../../features/students/useStudents";
import { useAppSelector } from "../../app/hooks";
import StatCard from "../../components/ui/StatCard";
import PageHeader from "../../components/ui/PageHeader";
// import DataTable          from "../../components/ui/DataTable"
// import Badge              from "../../components/ui/Badge"
// import Avatar             from "../../components/ui/Avatar"
// import { CardSkeleton }   from "../../components/ui/Skeleton"
// import type { Column }    from "../../components/ui/DataTable"
import type { Student } from "../../services/studentService";
import type { Column } from "../../Component/ui/DataTable";
import Avatar from "../../Component/ui/Avatar";
import Badge from "../../Component/ui/Badge";
import { CardSkeleton } from "../../Component/ui/Skeleton";
import DataTable from "../../Component/ui/DataTable";

// ── Recent notices mock ─────────────────────────────────
const RECENT_NOTICES = [
  {
    id: "1",
    title: "Annual Sports Week",
    forRole: "ALL",
    date: "May 10, 2024",
    urgent: true,
  },
  {
    id: "2",
    title: "CS101 Exam Schedule",
    forRole: "STUDENT",
    date: "May 10, 2024",
    urgent: false,
  },
  {
    id: "3",
    title: "Holiday Notice",
    forRole: "ALL",
    date: "May 9, 2024",
    urgent: false,
  },
  {
    id: "4",
    title: "Semester Break",
    forRole: "ALL",
    date: "May 8, 2024",
    urgent: false,
  },
];

// ── Table columns ────────────────────────────────────────
const STUDENT_COLUMNS: Column<Student>[] = [
  {
    key: "fullName",
    label: "Student",
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.fullName} size="sm" />
        <div>
          <p className="text-ink-100 font-medium text-sm">{row.fullName}</p>
          <p className="text-xs text-ink-500">{row.email}</p>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "rollNo",
    label: "Roll No",
    sortable: true,
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge
        label={row.status}
        variant={
          row.status === "ACTIVE"
            ? "success"
            : row.status === "PENDING"
              ? "warning"
              : "danger"
        }
      />
    ),
  },
];

// ── Component ────────────────────────────────────────────
export default function AdminDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: students = [], isLoading: studentsLoading } = useStudents();

  // Show only 5 most recent students on dashboard
  const recentStudents = useMemo(() => [...students].slice(0, 5), [students]);

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-8">
      {/* ── Header ───────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-2"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-ink-50">
            {greeting},{" "}
            <span className="gradient-text">{user?.fullName ?? "Admin"}</span>{" "}
            👋
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            {today} · Here's what's happening in your college today.
          </p>
        </div>
      </div>

      {/* ── Stats cards ──────────────────────────────── */}
      {statsLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total students"
            value={stats?.totalStudents ?? 0}
            icon={GraduationCap}
            change={`+${stats?.newStudents ?? 0} this month`}
            positive
            color="jade"
          />
          <StatCard
            label="Total teachers"
            value={stats?.totalTeachers ?? 0}
            icon={Users}
            color="ink"
          />
          <StatCard
            label="Active courses"
            value={stats?.totalCourses ?? 0}
            icon={BookOpen}
            color="gold"
          />
          <StatCard
            label="Notices posted"
            value={stats?.totalNotices ?? 0}
            icon={Bell}
            color="jade"
          />
        </div>
      )}

      {/* ── Main content — 2 columns on large screens ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent students table — takes 2/3 width */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-100">
              Recent students
            </h2>
            <a
              href="/admin/students"
              className="text-xs text-jade-400 hover:text-jade-300 font-mono
              transition-colors"
            >
              View all →
            </a>
          </div>

          <DataTable
            data={recentStudents}
            columns={STUDENT_COLUMNS}
            loading={studentsLoading}
            searchable={false}
            pageSize={5}
            emptyTitle="No students yet"
            emptyDesc="Add your first student to get started"
            actions={(row) => (
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-lg text-ink-500
                             hover:text-jade-400 hover:bg-jade-500/10
                             transition-colors"
                  title="Edit"
                >
                  <Pencil size={13} />
                </button>
                <button
                  className="p-1.5 rounded-lg text-ink-500
                             hover:text-red-400 hover:bg-red-500/10
                             transition-colors"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          />
        </div>

        {/* Right column — notices + quick stats */}
        <div className="flex flex-col gap-5">
          {/* Students overview card */}
          <div className="glass rounded-2xl p-5">
            <p
              className="text-xs font-mono text-ink-500 uppercase
                          tracking-wider mb-4"
            >
              Students overview
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-ink-300">
                  <UserCheck size={14} className="text-jade-500" />
                  Active
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-jade-500"
                      style={{
                        width: `${
                          stats
                            ? (stats.activeStudents / stats.totalStudents) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-ink-400 w-8 text-right">
                    {stats?.activeStudents ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-ink-300">
                  <TrendingUp size={14} className="text-gold-500" />
                  New this month
                </div>
                <span className="text-xs font-mono text-ink-400">
                  +{stats?.newStudents ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Recent notices */}
          <div className="glass rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-mono text-ink-500 uppercase
                            tracking-wider"
              >
                Recent notices
              </p>
              <a
                href="/admin/notices"
                className="text-xs text-jade-400 hover:text-jade-300 font-mono transition-colors"
              >
                View all →
              </a>
            </div>

            <ul className="flex flex-col gap-2">
              {RECENT_NOTICES.map((notice) => (
                <li
                  key={notice.id}
                  className="flex items-start gap-3 p-3 rounded-xl
                             hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      notice.urgent ? "bg-red-400" : "bg-jade-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-200 truncate">
                      {notice.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-ink-500">
                        {notice.date}
                      </span>
                      <Badge
                        label={notice.forRole}
                        variant={
                          notice.forRole === "ALL"
                            ? "info"
                            : notice.forRole === "STUDENT"
                              ? "success"
                              : "warning"
                        }
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
