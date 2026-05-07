import { useMemo } from "react";
import { BookOpen, UserCheck, Bell, TrendingUp, Star } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { useCourses } from "../../features/courses/useCourses";
import { useMyNotices } from "../../features/notices/useNotices";
import StatCard from "../../components/ui/StatCard";

import clsx from "clsx";
import Badge from "../../Component/ui/Badge";

// ── Mock student academic data ───────────────────────────
const MY_ENROLLED_COURSES = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS101",
    teacher: "John Doe",
    progress: 75,
    attendance: 88,
    grade: "A",
  },
  {
    id: "2",
    name: "Database Systems",
    code: "CS102",
    teacher: "Sarah Miller",
    progress: 60,
    attendance: 92,
    grade: "B+",
  },
  {
    id: "3",
    name: "Web Development",
    code: "IT201",
    teacher: "Raj Thapa",
    progress: 85,
    attendance: 78,
    grade: "A+",
  },
  {
    id: "4",
    name: "Computer Networks",
    code: "CS401",
    teacher: "Anita Gurung",
    progress: 45,
    attendance: 70,
    grade: "B",
  },
];

const UPCOMING_EVENTS = [
  {
    id: "1",
    title: "CS101 Mid-term Exam",
    date: "May 18, 2024",
    type: "exam",
  },
  {
    id: "2",
    title: "Web Dev Project Due",
    date: "May 22, 2024",
    type: "assignment",
  },
  {
    id: "3",
    title: "Annual Sports Week",
    date: "May 20-25, 2024",
    type: "event",
  },
];

// ── GPA calculation from grades ──────────────────────────
const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  F: 0.0,
};

function calculateGPA(courses: typeof MY_ENROLLED_COURSES): string {
  const points = courses.map((c) => GRADE_POINTS[c.grade] ?? 0);
  const avg = points.reduce((a, b) => a + b, 0) / points.length;
  return avg.toFixed(2);
}

// ── Progress bar ─────────────────────────────────────────
function ProgressBar({
  value,
  color = "jade",
}: {
  value: number;
  color?: "jade" | "gold" | "red";
}) {
  const colors = {
    jade: "bg-jade-500",
    gold: "bg-gold-500",
    red: "bg-red-500",
  };
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export default function StudentDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: notices = [] } = useMyNotices();

  const gpa = useMemo(() => calculateGPA(MY_ENROLLED_COURSES), []);

  const avgAttendance = useMemo(() => {
    const avg =
      MY_ENROLLED_COURSES.reduce((a, c) => a + c.attendance, 0) /
      MY_ENROLLED_COURSES.length;
    return Math.round(avg);
  }, []);

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

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-ink-50">
          {greeting},{" "}
          <span className="gradient-text">{user?.fullName ?? "Student"}</span>{" "}
          👋
        </h1>
        <p className="text-sm text-ink-500 mt-1">
          {today} · Keep up the great work!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="My GPA"
          value={gpa}
          icon={Star}
          color="gold"
          change="This semester"
          positive
        />
        <StatCard
          label="Attendance"
          value={`${avgAttendance}%`}
          icon={UserCheck}
          color="jade"
          change={avgAttendance >= 75 ? "Above minimum" : "Below minimum"}
          positive={avgAttendance >= 75}
        />
        <StatCard
          label="Enrolled courses"
          value={MY_ENROLLED_COURSES.length}
          icon={BookOpen}
          color="ink"
        />
        <StatCard
          label="Notices"
          value={notices.length}
          icon={Bell}
          color="jade"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* My courses — 2/3 width */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-100">My courses</h2>
            <a
              href="/student/courses"
              className="text-xs text-jade-400 hover:text-jade-300
                         font-mono transition-colors"
            >
              View all →
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {MY_ENROLLED_COURSES.map((course) => (
              <div
                key={course.id}
                className="glass rounded-2xl p-5 hover:border-white/20
                           transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-jade-400">
                        {course.code}
                      </span>
                      <Badge label={course.grade} variant="success" />
                    </div>
                    <h3 className="font-medium text-ink-100">{course.name}</h3>
                    <p className="text-xs text-ink-500 mt-0.5">
                      {course.teacher}
                    </p>
                  </div>
                </div>

                {/* Progress + attendance */}
                <div className="flex flex-col gap-3">
                  <div>
                    <div
                      className="flex items-center justify-between
                                    mb-1.5"
                    >
                      <span className="text-xs text-ink-500">
                        Course progress
                      </span>
                      <span className="text-xs font-mono text-ink-300">
                        {course.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      value={course.progress}
                      color={
                        course.progress >= 70
                          ? "jade"
                          : course.progress >= 40
                            ? "gold"
                            : "red"
                      }
                    />
                  </div>

                  <div>
                    <div
                      className="flex items-center justify-between
                                    mb-1.5"
                    >
                      <span className="text-xs text-ink-500">Attendance</span>
                      <span
                        className={`text-xs font-mono ${
                          course.attendance >= 75
                            ? "text-jade-400"
                            : "text-red-400"
                        }`}
                      >
                        {course.attendance}%
                      </span>
                    </div>
                    <ProgressBar
                      value={course.attendance}
                      color={course.attendance >= 75 ? "jade" : "red"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Upcoming events */}
          <div className="glass rounded-2xl p-5">
            <p
              className="text-xs font-mono text-ink-500 uppercase
                          tracking-wider mb-4"
            >
              Upcoming events
            </p>
            <div className="flex flex-col gap-3">
              {UPCOMING_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-xl
                             hover:bg-white/5 transition-colors"
                >
                  <div
                    className={clsx(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      event.type === "exam" && "bg-red-400",
                      event.type === "assignment" && "bg-gold-400",
                      event.type === "event" && "bg-jade-400",
                    )}
                  />
                  <div>
                    <p className="text-sm text-ink-200">{event.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent notices */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-xs font-mono text-ink-500 uppercase
                            tracking-wider"
              >
                Recent notices
              </p>
              <a
                href="/student/notices"
                className="text-xs text-jade-400 hover:text-jade-300
                           font-mono transition-colors"
              >
                View all →
              </a>
            </div>
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

          {/* GPA breakdown */}
          <div className="glass rounded-2xl p-5">
            <p
              className="text-xs font-mono text-ink-500 uppercase
                          tracking-wider mb-4"
            >
              Grade summary
            </p>
            <div className="flex flex-col gap-2">
              {MY_ENROLLED_COURSES.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-ink-400 truncate flex-1 mr-2">
                    {course.code}
                  </span>
                  <span
                    className={clsx(
                      "font-mono text-sm font-medium",
                      course.grade.startsWith("A") && "text-jade-400",
                      course.grade.startsWith("B") && "text-gold-400",
                      course.grade.startsWith("C") && "text-red-400",
                    )}
                  >
                    {course.grade}
                  </span>
                </div>
              ))}
              <div className="divider my-1" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-300">GPA</span>
                <span
                  className="font-mono text-base font-medium
                                 text-jade-400"
                >
                  {gpa}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
