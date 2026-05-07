import { useMemo } from "react";
import { GraduationCap, BookOpen, UserCheck, Bell, Clock } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { useStudents } from "../../features/students/useStudents";
import { useCourses } from "../../features/courses/useCourses";
import { useMyNotices } from "../../features/notices/useNotices";
import StatCard from "../../components/ui/StatCard";
import { CardSkeleton } from "../../Component/ui/Skeleton";
import Badge from "../../Component/ui/Badge";

// ── Mock schedule ────────────────────────────────────────
const TODAY_SCHEDULE = [
  {
    id: "1",
    course: "Data Structures",
    code: "CS101",
    time: "09:00 AM",
    duration: "1h 30m",
    room: "Hall A",
    students: 45,
  },
  {
    id: "2",
    course: "Database Systems",
    code: "CS102",
    time: "11:00 AM",
    duration: "1h 30m",
    room: "Lab 2",
    students: 38,
  },
  {
    id: "3",
    course: "Web Development",
    code: "IT201",
    time: "02:00 PM",
    duration: "2h 00m",
    room: "Lab 1",
    students: 52,
  },
];

export default function TeacherDashboard() {
  const user = useAppSelector((s) => s.auth.user);

  const { data: students = [], isLoading: sLoading } = useStudents();
  const { data: courses = [], isLoading: cLoading } = useCourses();
  const { data: notices = [] } = useMyNotices();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const isLoading = sLoading || cLoading;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-ink-50">
          {greeting},{" "}
          <span className="gradient-text">{user?.fullName ?? "Teacher"}</span>{" "}
          👋
        </h1>
        <p className="text-sm text-ink-500 mt-1">
          {today} · Here's your day at a glance.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="My courses" value={4} icon={BookOpen} color="jade" />
          <StatCard
            label="My students"
            value={students.length}
            icon={GraduationCap}
            color="ink"
          />
          <StatCard
            label="Attendance avg"
            value="85%"
            icon={UserCheck}
            color="gold"
          />
          <StatCard
            label="Notices"
            value={notices.length}
            icon={Bell}
            color="jade"
          />
        </div>
      )}

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's schedule — 2/3 width */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="font-display text-lg text-ink-100">
            Today's schedule
          </h2>

          <div className="flex flex-col gap-3">
            {TODAY_SCHEDULE.map((cls, i) => (
              <div
                key={cls.id}
                className="glass rounded-2xl p-5 flex items-center
                           gap-4 hover:border-white/20
                           transition-all duration-200"
              >
                {/* Time */}
                <div className="text-center w-16 shrink-0">
                  <p className="font-mono text-sm font-medium text-jade-400">
                    {cls.time}
                  </p>
                  <p className="text-xs text-ink-500 mt-0.5">{cls.duration}</p>
                </div>

                {/* Divider */}
                <div className="w-px h-12 bg-white/[0.07] shrink-0" />

                {/* Course info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink-100 truncate">
                    {cls.course}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-xs text-jade-400">
                      {cls.code}
                    </span>
                    <span className="text-xs text-ink-500">{cls.room}</span>
                    <span className="text-xs text-ink-500">
                      {cls.students} students
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <Badge
                  label={i === 0 ? "Next up" : i === 1 ? "Upcoming" : "Later"}
                  variant={
                    i === 0 ? "success" : i === 1 ? "warning" : "default"
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* My courses quick view */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-xs font-mono text-ink-500
                            uppercase tracking-wider"
              >
                My courses
              </p>
              <a
                href="/teacher/students"
                className="text-xs text-jade-400 hover:text-jade-300
                           font-mono transition-colors"
              >
                View all →
              </a>
            </div>

            <div className="flex flex-col gap-2">
              {TODAY_SCHEDULE.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl
                             hover:bg-white/5 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg bg-jade-500/10
                                  border border-jade-500/20
                                  flex items-center justify-center shrink-0"
                  >
                    <BookOpen size={13} className="text-jade-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-200 truncate">
                      {cls.course}
                    </p>
                    <p className="text-xs text-ink-500">
                      {cls.students} enrolled
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent notices */}
          <div className="glass rounded-2xl p-5">
            <p
              className="text-xs font-mono text-ink-500
                          uppercase tracking-wider mb-4"
            >
              Recent notices
            </p>
            <div className="flex flex-col gap-2">
              {notices.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl
                             hover:bg-white/5 transition-colors"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      n.urgent ? "bg-red-400" : "bg-jade-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-200 truncate">{n.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
