import { useState, useMemo } from "react";
import { Save, Calculator, TrendingUp, Users, Target, ClipboardList, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isAxiosError } from "axios";
import { useCourses } from "../../features/courses/useCourses";
import { useStudents } from "../../features/students/useStudents";
import { markService } from "../../services/markService";
import { useToast } from "../../Component/ui/Toast";
import PageHeader from "../../components/ui/PageHeader";
import Avatar from "../../Component/ui/Avatar";
import clsx from "clsx";

const EXAM_TYPES = [
  { value: "INTERNAL", label: "Internal", max: 30 },
  { value: "MIDTERM", label: "Mid-term", max: 30 },
  { value: "FINAL", label: "Final", max: 40 },
];

type ExamType = "INTERNAL" | "MIDTERM" | "FINAL";

export default function Marks() {
  const toast = useToast();
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: students = [], isLoading: studentsLoading } = useStudents();

  const [courseSelection, setCourseSelection] = useState("");
  const [selectedExam, setSelectedExam] = useState<ExamType>("INTERNAL");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const selectedCourse = courseSelection || courses[0]?.id || "";
  const course = courses.find((c) => c.id === selectedCourse);
  const exam = EXAM_TYPES.find((e) => e.value === selectedExam)!;
  const isLoading = coursesLoading || studentsLoading;
  const enteredMarks = students.flatMap((student) => {
    const value = marks[student.id]?.trim();
    return value !== undefined && value !== ""
      ? [{ studentId: student.id, marksObtained: Number(value), totalMarks: exam.max }]
      : [];
  });

  const selectCourse = (courseId: string) => {
    setCourseSelection(courseId);
    setMarks({});
  };

  const selectExam = (examType: ExamType) => {
    setSelectedExam(examType);
    setMarks({});
  };

  const setMark = (studentId: string, value: string) => {
    const num = Number(value);
    if (value !== "" && (!Number.isFinite(num) || num < 0 || num > exam.max)) return;
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = async () => {
    if (!course || enteredMarks.length === 0) return;

    setIsSaving(true);
    try {
      await markService.upload({
        courseId: course.id,
        examType: selectedExam,
        semester: course.semester,
        records: enteredMarks,
      });
      toast.success("Marks synchronized", `Academic records updated for ${course.name}.`);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "Please try again"
        : "Please try again";
      toast.error("Failed to publish grades", message);
    } finally {
      setIsSaving(false);
    }
  };

  const stats = useMemo(() => {
    const values = students
      .map((s) => marks[s.id]?.trim())
      .filter((value): value is string => value !== undefined && value !== "")
      .map(Number)
      .filter(Number.isFinite);

    if (values.length === 0) return null;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { avg: avg.toFixed(1), max, min, count: values.length };
  }, [marks, students]);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Grade Assessment"
          subtitle="Submit internal, midterm, and final examination marks."
          action={
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading || !course || enteredMarks.length === 0}
              className="btn-primary py-3 px-8 shadow-brand-500/10 disabled:opacity-50"
            >
              {isSaving ? "Synchronizing..." : <><Save size={18} /> Publish Grades</>}
            </button>
          }
        />
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Selection Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-base p-6 bg-white border-zinc-100">
            <div className="flex items-center gap-2 mb-4 text-xs font-medium text-zinc-400 uppercase tracking-widest">
              <ClipboardList size={14} /> Academic Unit
            </div>
            <div className="space-y-2">
              {coursesLoading ? (
                <p className="px-4 py-3 text-sm text-zinc-400">Loading courses...</p>
              ) : courses.length === 0 ? (
                <p className="px-4 py-3 text-sm text-zinc-400">No courses available.</p>
              ) : courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCourse(c.id)}
                  disabled={isSaving}
                  className={clsx(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    selectedCourse === c.id
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                      : "text-zinc-500 hover:bg-zinc-50 border border-transparent hover:border-zinc-100"
                  )}
                >
                  <p className="text-[10px] opacity-70 mb-0.5">{c.code}</p>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card-base p-6 bg-white border-zinc-100">
            <div className="flex items-center gap-2 mb-4 text-xs font-medium text-zinc-400 uppercase tracking-widest">
              <Target size={14} /> Assessment Type
            </div>
            <div className="space-y-2">
              {EXAM_TYPES.map((e) => (
                <button
                  key={e.value}
                  onClick={() => selectExam(e.value as ExamType)}
                  disabled={isSaving}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                    selectedExam === e.value
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-lg"
                      : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200"
                  )}
                >
                  {e.label}
                  <span className={clsx("text-[10px] font-mono", selectedExam === e.value ? "text-zinc-400" : "text-zinc-400")}>
                    MAX: {e.max}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grade Entry Area */}
        <div className="lg:col-span-3 space-y-6">
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-base p-4 bg-white border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Calculator size={14} /> <span className="text-[10px] font-medium uppercase tracking-wider">Average</span>
                </div>
                <p className="text-2xl font-display font-medium text-brand-600">{stats.avg}</p>
              </div>
              <div className="card-base p-4 bg-white border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <TrendingUp size={14} /> <span className="text-[10px] font-medium uppercase tracking-wider">Highest</span>
                </div>
                <p className="text-2xl font-display font-medium text-emerald-600">{stats.max}</p>
              </div>
              <div className="card-base p-4 bg-white border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Target size={14} /> <span className="text-[10px] font-medium uppercase tracking-wider">Lowest</span>
                </div>
                <p className="text-2xl font-display font-medium text-rose-600">{stats.min}</p>
              </div>
              <div className="card-base p-4 bg-white border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Users size={14} /> <span className="text-[10px] font-medium uppercase tracking-wider">Entered</span>
                </div>
                <p className="text-2xl font-display font-medium text-zinc-900">{stats.count}</p>
              </div>
            </div>
          )}

          <div className="card-base bg-white border-zinc-100 overflow-hidden shadow-sm">
            {studentsLoading ? (
              <div className="p-20 text-center text-zinc-400 font-medium">Loading class roster...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-50 bg-zinc-50/50">
                    <th className="px-6 py-4 text-[10px] font-medium text-zinc-400 uppercase tracking-widest w-16">#</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Student Information</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-zinc-400 uppercase tracking-widest text-center">Roll No</th>
                    <th className="px-6 py-4 text-[10px] font-medium text-zinc-400 uppercase tracking-widest text-right">Assessment Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  <AnimatePresence mode="popLayout">
                    {students.map((student, index) => {
                      const val = marks[student.id] ?? "";
                      const numVal = parseFloat(val);
                      const isPassing = numVal >= exam.max * 0.4;
                      const hasValue = val !== "" && !isNaN(numVal);

                      return (
                        <motion.tr
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          key={student.id}
                          className="group hover:bg-zinc-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-xs font-medium text-zinc-300">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <Avatar name={student.fullName} size="md" className="border-2 border-white shadow-sm" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-zinc-900 truncate">{student.fullName}</p>
                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 uppercase mt-0.5">
                                  <GraduationCap size={12} /> {student.department?.name ?? "Unassigned"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-xs font-medium text-zinc-500">{student.rollNo}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <input
                                type="number"
                                min={0}
                                max={exam.max}
                                value={val}
                                onChange={(e) => setMark(student.id, e.target.value)}
                                disabled={isSaving}
                                placeholder="—"
                                className={clsx(
                                  "w-24 px-4 py-2.5 rounded-xl text-sm font-medium text-right transition-all border outline-none",
                                  hasValue
                                    ? isPassing
                                      ? "bg-emerald-50 border-emerald-100 text-emerald-700 ring-2 ring-emerald-500/10"
                                      : "bg-rose-50 border-rose-100 text-rose-700 ring-2 ring-rose-500/10"
                                    : "bg-zinc-50 border-zinc-100 text-zinc-400 focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-500/5"
                                )}
                              />
                              <span className="text-[10px] font-medium text-zinc-300 uppercase tracking-tighter w-8 text-left">/ {exam.max}</span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
