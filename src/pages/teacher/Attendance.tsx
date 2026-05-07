import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStudents } from "../../features/students/useStudents";

import clsx from "clsx";
import { useToast } from "../../Component/ui/Toast";
import PageHeader from "../../components/ui/PageHeader";
import Avatar from "../../Component/ui/Avatar";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
}

const MY_COURSES = [
  { id: "1", name: "Data Structures", code: "CS101" },
  { id: "2", name: "Database Systems", code: "CS102" },
  { id: "3", name: "Web Development", code: "IT201" },
];

// ── Status button config ─────────────────────────────────
const STATUS_CONFIG = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle2,
    active: "bg-jade-500/20 border-jade-500/40 text-jade-300",
    hover: "hover:border-jade-500/30 hover:text-jade-400",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    active: "bg-red-500/20 border-red-500/40 text-red-300",
    hover: "hover:border-red-500/30 hover:text-red-400",
  },
  LATE: {
    label: "Late",
    icon: Clock,
    active: "bg-gold-500/20 border-gold-500/40 text-gold-300",
    hover: "hover:border-gold-500/30 hover:text-gold-400",
  },
};

export default function Attendance() {
  const toast = useToast();
  const { data: students = [], isLoading } = useStudents();

  const [selectedCourse, setSelectedCourse] = useState(MY_COURSES[0].id);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  // Default all students to PRESENT on load
  useMemo(() => {
    const defaults: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      defaults[s.id] = attendance[s.id] ?? "PRESENT";
    });
    setAttendance(defaults);
  }, [students]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  // Mark all present at once
  const markAllPresent = () => {
    const all: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      all[s.id] = "PRESENT";
    });
    setAttendance(all);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success(
      "Attendance saved",
      `${students.length} records saved for ${
        MY_COURSES.find((c) => c.id === selectedCourse)?.name
      }`,
    );
  };

  // Summary counts
  const counts = useMemo(() => {
    const values = Object.values(attendance);
    return {
      present: values.filter((v) => v === "PRESENT").length,
      absent: values.filter((v) => v === "ABSENT").length,
      late: values.filter((v) => v === "LATE").length,
    };
  }, [attendance]);

  // Date navigation helpers
  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Attendance Entry"
        subtitle="Mark attendance for your classes"
        action={
          <button
            onClick={handleSave}
            disabled={isSaving || students.length === 0}
            className="btn-primary disabled:opacity-60
                       disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSaving ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-white/30
                                 border-t-white rounded-full animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} />
                Save attendance
              </>
            )}
          </button>
        }
      />

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Course selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {MY_COURSES.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium
                          border transition-all duration-200 ${
                            selectedCourse === course.id
                              ? "bg-jade-500/15 border-jade-500/40 text-jade-300"
                              : "border-white/[0.07] text-ink-400 hover:border-white/20"
                          }`}
            >
              {course.code}
            </button>
          ))}
        </div>

        {/* Date navigator */}
        <div
          className="flex items-center gap-2 sm:ml-auto glass
                        rounded-xl px-3 py-2"
        >
          <button
            onClick={() => changeDate(-1)}
            className="p-1 rounded-lg hover:bg-white/5
                       text-ink-400 hover:text-ink-200 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-sm text-ink-200
                       font-mono focus:outline-none cursor-pointer"
          />
          <button
            onClick={() => changeDate(1)}
            className="p-1 rounded-lg hover:bg-white/5
                       text-ink-400 hover:text-ink-200 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Summary + mark all */}
      <div
        className="flex items-center justify-between
                      glass rounded-xl px-4 py-3"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-jade-500" />
            <span className="text-ink-300 font-mono">{counts.present}</span>
            <span className="text-ink-500">present</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-ink-300 font-mono">{counts.absent}</span>
            <span className="text-ink-500">absent</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            <span className="text-ink-300 font-mono">{counts.late}</span>
            <span className="text-ink-500">late</span>
          </span>
        </div>

        <button
          onClick={markAllPresent}
          className="text-xs text-jade-400 hover:text-jade-300
                     font-mono transition-colors"
        >
          Mark all present
        </button>
      </div>

      {/* Attendance grid */}
      {isLoading ? (
        <div className="glass rounded-2xl p-8 text-center text-ink-500">
          Loading students...
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/4">
            {students.map((student, index) => {
              const status = attendance[student.id] ?? "PRESENT";

              return (
                <div
                  key={student.id}
                  className="flex items-center gap-4 px-4 py-3
                             hover:bg-white/2 transition-colors"
                >
                  {/* Index */}
                  <span className="font-mono text-xs text-ink-600 w-6 shrink-0">
                    {index + 1}
                  </span>

                  {/* Student info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar name={student.fullName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-100 truncate">
                        {student.fullName}
                      </p>
                      <p className="text-xs text-ink-500">{student.rollNo}</p>
                    </div>
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {(
                      Object.entries(STATUS_CONFIG) as [
                        AttendanceStatus,
                        typeof STATUS_CONFIG.PRESENT,
                      ][]
                    ).map(([s, config]) => {
                      const Icon = config.icon;
                      const isActive = status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setStatus(student.id, s)}
                          className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5",
                            "rounded-lg border text-xs font-medium",
                            "transition-all duration-150",
                            isActive
                              ? config.active
                              : `border-white/[0.07] text-ink-500 ${config.hover}`,
                          )}
                        >
                          <Icon size={12} />
                          <span className="hidden sm:inline">
                            {config.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
