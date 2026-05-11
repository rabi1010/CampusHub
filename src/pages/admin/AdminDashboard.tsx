import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  Bell,
  TrendingUp,
  UserCheck,
  Pencil,
  Trash2,
  ArrowUpRight,
  Clock,
  ExternalLink,
  Plus,
  ChevronRight,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdminStats } from "../../features/stats/useStats";
import { useStudents } from "../../features/students/useStudents";
import { useAppSelector } from "../../app/hooks";
import StatCard from "../../components/ui/StatCard";
import type { Student } from "../../services/studentService";
import type { Column } from "../../Component/ui/DataTable";
import Avatar from "../../Component/ui/Avatar";
import Badge from "../../Component/ui/Badge";
import { CardSkeleton } from "../../Component/ui/Skeleton";
import DataTable from "../../Component/ui/DataTable";

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
];

const STUDENT_COLUMNS: Column<Student>[] = [
  {
    key: "fullName",
    label: "Student Profile",
    render: (row) => (
      <div className="flex items-center gap-4 py-1">
        <Avatar
          name={row.fullName}
          size="md"
          className="border-2 border-white shadow-sm ring-1 ring-slate-100"
        />
        <div>
          <p className="text-slate-900 font-bold text-sm leading-tight">
            {row.fullName}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">{row.email}</p>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "rollNo",
    label: "Roll Number",
    render: (row) => (
      <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
        <Hash size={12} className="text-brand-500" />
        {row.rollNo}
      </div>
    ),
    sortable: true,
  },
  {
    key: "department",
    label: "Department",
    render: (row) => (
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        {row.department}
      </div>
    ),
    sortable: true,
  },
  {
    key: "status",
    label: "Account Status",
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

export default function AdminDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: students = [], isLoading: studentsLoading } = useStudents();

  const recentStudents = useMemo(() => [...students].slice(0, 5), [students]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-10">
      {/* ── Dynamic Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-brand-600 font-bold text-[10px] uppercase tracking-[0.25em]">
            <Clock size={14} /> {today}
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight tracking-tight">
            {greeting},{" "}
            <span className="text-brand-600">
              {user?.fullName?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Central control system for institutional operations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3"
        >
          <Link
            to="/admin/students"
            className="btn-primary py-3.5 px-8 text-sm shadow-xl shadow-brand-500/15"
          >
            Student Registry <ArrowUpRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* ── KPI Stats Grid ── */}
      {statsLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Enrolled Students"
            value={stats?.totalStudents ?? 0}
            icon={GraduationCap}
            change={`+${stats?.newStudents ?? 0} this cycle`}
            positive
            color="brand"
          />
          <StatCard
            label="Faculty Experts"
            value={stats?.totalTeachers ?? 0}
            icon={Users}
            color="emerald"
          />
          <StatCard
            label="Curriculum Modules"
            value={stats?.totalCourses ?? 0}
            icon={BookOpen}
            color="brand"
          />
          <StatCard
            label="Operational Bulletins"
            value={stats?.totalNotices ?? 0}
            icon={Bell}
            color="amber"
          />
        </div>
      )}

      {/* ── Core Management Grid ── */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Recent Enrollments Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              Institutional Registry
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] rounded-full font-bold uppercase tracking-widest border border-emerald-100">
                <TrendingUp size={12} /> Live Updates
              </div>
            </h2>
            <Link
              to="/admin/students"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-all"
            >
              Comprehensive Directory <ExternalLink size={14} />
            </Link>
          </div>

          <div className="card-base overflow-hidden border-slate-100 bg-white shadow-sm">
            <DataTable
              data={recentStudents}
              columns={STUDENT_COLUMNS}
              loading={studentsLoading}
              searchable={false}
              pageSize={5}
              emptyTitle="No Recent Data"
              emptyDesc="Newly registered students will be cataloged here automatically."
              actions={() => (
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100">
                    <Pencil size={14} />
                  </button>
                  <button className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            />
          </div>
        </div>

        {/* Operational Insights Sidebar */}
        <div className="space-y-8">
          {/* Capacity Analytics Widget */}
          <div className="card-base p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">
                Performance Metrics
              </p>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <UserCheck size={16} className="text-brand-400" />{" "}
                      Enrollment Ratio
                    </span>
                    <span className="text-sm font-display font-bold text-white">
                      {stats
                        ? Math.round(
                            (stats.activeStudents / stats.totalStudents) * 100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: stats
                          ? `${(stats.activeStudents / stats.totalStudents) * 100}%`
                          : 0,
                      }}
                      className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Stability
                    </p>
                    <p className="text-2xl font-display font-bold text-emerald-400 leading-none">
                      98.2%
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      New Intake
                    </p>
                    <p className="text-2xl font-display font-bold text-brand-400 leading-none">
                      +{stats?.newStudents ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bulletin Overview Widget */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 px-2 uppercase tracking-widest">
              Active Bulletins
            </h3>
            <div className="space-y-3">
              {RECENT_NOTICES.map((notice) => (
                <div
                  key={notice.id}
                  className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        label={notice.forRole}
                        variant={notice.urgent ? "danger" : "info"}
                      />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                        {notice.date}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors truncate">
                      {notice.title}
                    </h4>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-brand-400 transition-colors shrink-0 ml-3"
                  />
                </div>
              ))}
              <Link
                to="/admin/notices"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-widest hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
              >
                <Plus size={14} /> Broadcast New Bulletin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
