import { useState } from "react";
import { BookOpen, User, CreditCard, Calendar, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../Component/ui/EmptyState";
import Badge from "../../Component/ui/Badge";
import clsx from "clsx";

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
    description: "Introduction to data structures and algorithms including arrays, linked lists, trees and graphs.",
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
    description: "Fundamentals of database design, SQL, normalization and transaction management.",
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
    description: "Modern web development using HTML, CSS, JavaScript and popular frameworks.",
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
    description: "Network architectures, protocols, TCP/IP, routing and switching fundamentals.",
  },
];

function ProgressBar({ value, colorClass }: { value: number; colorClass: string }) {
  return (
    <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-50">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={clsx("h-full rounded-full", colorClass)}
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
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Academic Registry"
          subtitle={`Actively enrolled in ${MY_COURSES.length} curriculum modules.`}
        />
      </motion.div>

      {/* Filter tabs */}
      <div className="flex items-center gap-3">
        {(["all", "active", "completed"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all border capitalize",
              filter === f
                ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/20"
                : "bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200 hover:bg-zinc-50"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Course grid */}
      {filtered.length === 0 ? (
        <div className="card-base bg-white p-12">
          <EmptyState
            icon={BookOpen}
            title="Registry Empty"
            description="No academic modules match your current filter criteria."
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((course, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={course.id}
                className="card-base p-6 bg-white border-zinc-100 flex flex-col gap-6 hover:shadow-xl hover:border-brand-100 transition-all group"
              >
                {/* Course header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                         <span className="font-mono text-[10px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                           {course.code}
                         </span>
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
                      <h3 className="text-lg font-medium text-zinc-900 group-hover:text-brand-600 transition-colors">
                        {course.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-50">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <User size={14} className="text-zinc-300" />
                    <span className="truncate">{course.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <CreditCard size={14} className="text-zinc-300" />
                    {course.credits} Credits
                  </div>
                </div>

                {/* Performance trackers */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-500" /> Academic Progress
                      </span>
                      <span className="font-mono text-xs font-medium text-zinc-600">{course.progress}%</span>
                    </div>
                    <ProgressBar
                      value={course.progress}
                      colorClass={
                        course.progress >= 70
                          ? "bg-emerald-500"
                          : course.progress >= 40
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        {course.attendance < 75 ? (
                          <AlertCircle size={12} className="text-rose-500" />
                        ) : (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        )}
                        Session Attendance
                      </span>
                      <span className={clsx("font-mono text-xs font-medium", course.attendance < 75 ? "text-rose-600" : "text-zinc-600")}>
                        {course.attendance}%
                      </span>
                    </div>
                    <ProgressBar
                      value={course.attendance}
                      colorClass={course.attendance >= 75 ? "bg-emerald-500" : "bg-rose-500"}
                    />
                  </div>
                </div>

                <div className="pt-2">
                   <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-50 text-zinc-600 text-xs font-medium hover:bg-brand-600 hover:text-white hover:shadow-lg hover:shadow-brand-500/20 transition-all border border-zinc-100 hover:border-brand-500">
                      Access Course Materials <ArrowRight size={14} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
