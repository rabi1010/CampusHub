import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Star,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";
import { useAttendanceSummary } from "../../features/attendance/useAttendance";
import { useCourses } from "../../features/courses/useCourses";
import { useGpa } from "../../features/marks/useMarks";
import { useMyNotices } from "../../features/notices/useNotices";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../Component/ui/Badge";

function queryValue(
  value: string | number | undefined,
  isLoading: boolean,
  isError: boolean,
) {
  if (isLoading) return "Loading";
  if (isError || value === undefined) return "Unavailable";
  return value;
}

export default function StudentDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const attendanceQuery = useAttendanceSummary();
  const gpaQuery = useGpa();
  const noticesQuery = useMyNotices();
  const coursesQuery = useCourses();

  const studentNotices = useMemo(
    () =>
      (noticesQuery.data ?? [])
        .filter(
          (notice) =>
            notice.forRole === "ALL" || notice.forRole === "STUDENT",
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [noticesQuery.data],
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const attendance = attendanceQuery.data;
  const attendanceValue = attendance
    ? `${attendance.attendancePercentage.toFixed(1)}%`
    : undefined;
  const gpaValue =
    gpaQuery.data === undefined ? undefined : gpaQuery.data.toFixed(2);

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-medium text-[10px] uppercase tracking-[0.25em]">
            <Calendar size={14} /> {today}
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-medium text-zinc-900 leading-tight tracking-tight">
            {greeting},{" "}
            <span className="text-brand-600">
              {user?.fullName?.split(" ")[0] || "Student"}
            </span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Review the academic information currently available to your account.
          </p>
        </div>
        <Link
          to="/student/courses"
          className="btn-primary py-3.5 px-8 text-sm shadow-xl shadow-brand-500/15"
        >
          View Course Catalog <ArrowRight size={18} />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Cumulative GPA"
          value={queryValue(gpaValue, gpaQuery.isLoading, gpaQuery.isError)}
          icon={Star}
          color="amber"
        />
        <StatCard
          label="Overall Attendance"
          value={queryValue(
            attendanceValue,
            attendanceQuery.isLoading,
            attendanceQuery.isError,
          )}
          icon={UserCheck}
          color="brand"
        />
        <StatCard
          label="Course Catalog"
          value={queryValue(
            coursesQuery.data?.length,
            coursesQuery.isLoading,
            coursesQuery.isError,
          )}
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          label="Student Notices"
          value={queryValue(
            noticesQuery.data ? studentNotices.length : undefined,
            noticesQuery.isLoading,
            noticesQuery.isError,
          )}
          icon={Bell}
          color="rose"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <section className="lg:col-span-2 card-base p-8 bg-white border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-zinc-900">
                Attendance Summary
              </h2>
              <p className="text-xs text-zinc-500">Recorded session totals</p>
            </div>
          </div>

          {attendanceQuery.isLoading ? (
            <p className="text-sm text-zinc-500">Loading attendance summary...</p>
          ) : attendanceQuery.isError ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Attendance information could not be loaded.
            </div>
          ) : attendance ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Present", attendance.present],
                ["Absent", attendance.absent],
                ["Late", attendance.late],
                ["Total", attendance.total],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-display font-medium text-zinc-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              No attendance summary is available.
            </p>
          )}
        </section>

        <section className="lg:col-span-3 card-base p-8 bg-white border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-medium text-zinc-900">Recent Notices</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Announcements for all users and students
              </p>
            </div>
            <Link
              to="/student/notices"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              View all
            </Link>
          </div>

          {noticesQuery.isLoading ? (
            <p className="text-sm text-zinc-500">Loading notices...</p>
          ) : noticesQuery.isError ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Notices could not be loaded.
            </div>
          ) : studentNotices.length === 0 ? (
            <p className="text-sm text-zinc-500">
              There are no notices for students right now.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {studentNotices.slice(0, 4).map((notice) => (
                <article key={notice.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <Badge
                          label={notice.forRole === "ALL" ? "All" : "Student"}
                          variant="info"
                        />
                        {notice.urgent && <Badge label="Urgent" variant="danger" />}
                      </div>
                      <h3 className="text-sm font-medium text-zinc-900">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                        {notice.content}
                      </p>
                    </div>
                    <time className="shrink-0 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
