import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const STATUS_CONFIG = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle2,
    active: "bg-emerald-50 border-emerald-100 text-emerald-600 ring-2 ring-emerald-500/20",
    hover: "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    active: "bg-rose-50 border-rose-100 text-rose-600 ring-2 ring-rose-500/20",
    hover: "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100",
  },
  LATE: {
    label: "Late",
    icon: Clock,
    active: "bg-amber-50 border-amber-100 text-amber-600 ring-2 ring-amber-500/20",
    hover: "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100",
  },
};

export default function Attendance() {
  const toast = useToast();
  const { data: students = [], isLoading } = useStudents();

  const [selectedCourse, setSelectedCourse] = useState(MY_COURSES[0].id);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSaving, setIsSaving] = useState(false);

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

  const markAllPresent = () => {
    const all: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      all[s.id] = "PRESENT";
    });
    setAttendance(all);
    toast.success("Batch Action", "All students marked as present.");
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success("Attendance saved", `${students.length} records synchronized successfully.`);
  };

  const counts = useMemo(() => {
    const values = Object.values(attendance);
    return {
      present: values.filter((v) => v === "PRESENT").length,
      absent: values.filter((v) => v === "ABSENT").length,
      late: values.filter((v) => v === "LATE").length,
    };
  }, [attendance]);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Attendance Portal"
          subtitle="Record and manage daily student participation."
          action={
            <button
              onClick={handleSave}
              disabled={isSaving || students.length === 0}
              className="btn-primary py-3 px-8 shadow-brand-500/10 disabled:opacity-50"
            >
              {isSaving ? "Synchronizing..." : <><Save size={18} /> Save Attendance</>}
            </button>
          }
        />
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-base p-6 bg-white border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <LayoutGrid size={14} /> Selected Class
            </div>
            <div className="space-y-2">
              {MY_COURSES.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={clsx(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    selectedCourse === course.id
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                      : "text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                  )}
                >
                  <p className="text-[10px] opacity-70 mb-0.5">{course.code}</p>
                  {course.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card-base p-6 bg-white border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Calendar size={14} /> Session Date
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white rounded-lg text-slate-400 transition-colors shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-sm text-slate-900 font-bold focus:outline-none flex-1 text-center"
              />
              <button onClick={() => changeDate(1)} className="p-2 hover:bg-white rounded-lg text-slate-400 transition-colors shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Present</p>
                <p className="text-xl font-display font-bold text-emerald-600">{counts.present}</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Absent</p>
                <p className="text-xl font-display font-bold text-rose-600">{counts.absent}</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Late</p>
                <p className="text-xl font-display font-bold text-amber-600">{counts.late}</p>
              </div>
            </div>
            <button
              onClick={markAllPresent}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100"
            >
              <UserCheck size={16} /> Mark All Present
            </button>
          </div>

          <div className="card-base bg-white border-slate-100 overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-20 text-center text-slate-400 font-medium">Loading class roster...</div>
            ) : (
              <div className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {students.map((student, index) => {
                    const status = attendance[student.id] ?? "PRESENT";
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        key={student.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <span className="font-mono text-xs font-bold text-slate-300 w-6">{index + 1}</span>
                          <Avatar name={student.fullName} size="md" className="border-2 border-white shadow-sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{student.fullName}</p>
                            <p className="text-[11px] font-bold text-slate-400 tracking-wider">ROLL: {student.rollNo}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {(Object.entries(STATUS_CONFIG) as [AttendanceStatus, typeof STATUS_CONFIG.PRESENT][]).map(([s, config]) => {
                            const Icon = config.icon;
                            const isActive = status === s;
                            return (
                              <button
                                key={s}
                                onClick={() => setStatus(student.id, s)}
                                className={clsx(
                                  "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm",
                                  isActive ? config.active : "bg-white border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-200"
                                )}
                              >
                                <Icon size={14} className={clsx(!isActive && "opacity-50")} />
                                {config.label}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
