import { useState } from "react";
import { BookOpen } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../Component/ui/EmptyState";
import Badge from "../../Component/ui/Badge";

const MY_COURSES = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS101",
    teacher: "John Doe",
    department: "Computer Science",
    credits: 3,
    semester: 1,
    progress: 75,
    attendance: 88,
    grade: "A",
    status: "ACTIVE" as const,
    description:
      "Introduction to data structures and algorithms including arrays, linked lists, trees and graphs.",
  },
  {
    id: "2",
    name: "Database Systems",
    code: "CS102",
    teacher: "Sarah Miller",
    department: "Computer Science",
    credits: 3,
    semester: 2,
    progress: 60,
    attendance: 92,
    grade: "B+",
    status: "ACTIVE" as const,
    description:
      "Fundamentals of database design, SQL, normalization and transaction management.",
  },
  {
    id: "3",
    name: "Web Development",
    code: "IT201",
    teacher: "Raj Thapa",
    department: "Information Technology",
    credits: 4,
    semester: 3,
    progress: 85,
    attendance: 78,
    grade: "A+",
    status: "ACTIVE" as const,
    description:
      "Modern web development using HTML, CSS, JavaScript and popular frameworks.",
  },
  {
    id: "4",
    name: "Computer Networks",
    code: "CS401",
    teacher: "Anita Gurung",
    department: "Computer Science",
    credits: 3,
    semester: 4,
    progress: 45,
    attendance: 70,
    grade: "B",
    status: "ACTIVE" as const,
    description:
      "Network architectures, protocols, TCP/IP, routing and switching fundamentals.",
  },
];

// ── Progress bar ─────────────────────────────────────────
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

type FilterType = "all" | "active" | "completed";

export default function MyCourses() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = MY_COURSES.filter((c) => {
    if (filter === "all") return true;
    if (filter === "active") return c.progress < 100;
    if (filter === "completed") return c.progress === 100;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Courses"
        subtitle={`${MY_COURSES.length} courses enrolled this semester`}
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(["all", "active", "completed"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium
                        border capitalize transition-all duration-200 ${
                          filter === f
                            ? "bg-jade-500/15 border-jade-500/40 text-jade-300"
                            : "border-white/[0.07] text-ink-400 hover:border-white/20"
                        }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Course grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="No courses match the selected filter."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="glass rounded-2xl p-6 flex flex-col gap-5
                         hover:border-white/20 transition-all duration-300
                         hover:-translate-y-0.5 hover:shadow-card-lg"
            >
              {/* Course header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl bg-gold-500/10
                                  border border-gold-500/20
                                  flex items-center justify-center shrink-0"
                  >
                    <BookOpen size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-jade-400 mb-0.5">
                      {course.code}
                    </p>
                    <h3 className="font-medium text-ink-100">{course.name}</h3>
                  </div>
                </div>
                <Badge
                  label={course.grade}
                  variant={
                    course.grade.startsWith("A")
                      ? "success"
                      : course.grade.startsWith("B")
                        ? "warning"
                        : "danger"
                  }
                />
              </div>

              {/* Description */}
              <p className="text-sm text-ink-500 leading-relaxed">
                {course.description}
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-ink-500">
                  👤 {course.teacher}
                </span>
                <span className="text-xs text-ink-500">
                  📚 {course.credits} credits
                </span>
                <span className="text-xs text-ink-500">
                  📅 Semester {course.semester}
                </span>
              </div>

              {/* Progress bars */}
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-ink-500">Progress</span>
                    <span className="text-xs font-mono text-ink-300">
                      {course.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    value={course.progress}
                    color={
                      course.progress >= 70
                        ? "bg-jade-500"
                        : course.progress >= 40
                          ? "bg-gold-500"
                          : "bg-red-500"
                    }
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-ink-500">Attendance</span>
                    <span
                      className={`text-xs font-mono ${
                        course.attendance >= 75
                          ? "text-jade-400"
                          : "text-red-400"
                      }`}
                    >
                      {course.attendance}%{course.attendance < 75 && " ⚠️"}
                    </span>
                  </div>
                  <ProgressBar
                    value={course.attendance}
                    color={
                      course.attendance >= 75 ? "bg-jade-500" : "bg-red-500"
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
