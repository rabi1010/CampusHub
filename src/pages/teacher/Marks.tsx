import { useState, useMemo } from "react";
import { Save, Download } from "lucide-react";
import { useStudents } from "../../features/students/useStudents";
import { useToast } from "../../Component/ui/Toast";
import PageHeader from "../../components/ui/PageHeader";
import Avatar from "../../Component/ui/Avatar";

const MY_COURSES = [
  { id: "1", name: "Data Structures", code: "CS101", totalMarks: 100 },
  { id: "2", name: "Database Systems", code: "CS102", totalMarks: 100 },
  { id: "3", name: "Web Development", code: "IT201", totalMarks: 100 },
];

const EXAM_TYPES = [
  { value: "INTERNAL", label: "Internal", max: 30 },
  { value: "MIDTERM", label: "Mid-term", max: 30 },
  { value: "FINAL", label: "Final", max: 40 },
];

type ExamType = "INTERNAL" | "MIDTERM" | "FINAL";

export default function Marks() {
  const toast = useToast();
  const { data: students = [], isLoading } = useStudents();

  const [selectedCourse, setSelectedCourse] = useState(MY_COURSES[0].id);
  const [selectedExam, setSelectedExam] = useState<ExamType>("INTERNAL");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const course = MY_COURSES.find((c) => c.id === selectedCourse)!;
  const exam = EXAM_TYPES.find((e) => e.value === selectedExam)!;

  const setMark = (studentId: string, value: string) => {
    // Only allow numbers within range
    const num = parseInt(value);
    if (value !== "" && (isNaN(num) || num < 0 || num > exam.max)) return;
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success(
      "Marks saved",
      `${selectedExam} marks saved for ${course.name}`,
    );
  };

  // Stats
  const stats = useMemo(() => {
    const values = students
      .map((s) => parseFloat(marks[s.id] ?? "0"))
      .filter((v) => !isNaN(v) && v > 0);

    if (values.length === 0) return null;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { avg: avg.toFixed(1), max, min, count: values.length };
  }, [marks, students]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Upload Marks"
        subtitle="Enter and save student marks"
        action={
          <button
            onClick={handleSave}
            disabled={isSaving}
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
                Save marks
              </>
            )}
          </button>
        }
      />

      {/* Course + exam type selectors */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Course */}
        <div className="flex items-center gap-2 flex-wrap">
          {MY_COURSES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium
                          border transition-all duration-200 ${
                            selectedCourse === c.id
                              ? "bg-jade-500/15 border-jade-500/40 text-jade-300"
                              : "border-white/[0.07] text-ink-400 hover:border-white/20"
                          }`}
            >
              {c.code}
            </button>
          ))}
        </div>

        {/* Exam type */}
        <div className="flex items-center gap-2 sm:ml-auto">
          {EXAM_TYPES.map((e) => (
            <button
              key={e.value}
              onClick={() => setSelectedExam(e.value as ExamType)}
              className={`px-4 py-2 rounded-xl text-sm font-medium
                          border transition-all duration-200 ${
                            selectedExam === e.value
                              ? "bg-ink-500/30 border-ink-400/40 text-ink-200"
                              : "border-white/[0.07] text-ink-400 hover:border-white/20"
                          }`}
            >
              {e.label}
              <span className="ml-1.5 font-mono text-xs opacity-60">
                /{e.max}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div
          className="flex items-center gap-6 glass
                        rounded-xl px-4 py-3"
        >
          <div className="text-center">
            <p className="font-mono text-lg text-jade-400">{stats.avg}</p>
            <p className="text-xs text-ink-500">Average</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg text-ink-200">{stats.max}</p>
            <p className="text-xs text-ink-500">Highest</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg text-ink-200">{stats.min}</p>
            <p className="text-xs text-ink-500">Lowest</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-lg text-ink-200">{stats.count}</p>
            <p className="text-xs text-ink-500">Entered</p>
          </div>
          <p className="ml-auto text-xs text-ink-500 font-mono">
            Max marks: {exam.max}
          </p>
        </div>
      )}

      {/* Marks table */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Table header */}
        <div
          className="flex items-center gap-4 px-4 py-3
                        border-b border-white/[0.07]"
        >
          <span className="w-6 text-xs font-mono text-ink-600">#</span>
          <span
            className="flex-1 text-xs font-mono text-ink-500
                           uppercase tracking-wider"
          >
            Student
          </span>
          <span
            className="w-32 text-xs font-mono text-ink-500
                           uppercase tracking-wider text-right"
          >
            Roll No
          </span>
          <span
            className="w-32 text-xs font-mono text-ink-500
                           uppercase tracking-wider text-right"
          >
            Marks / {exam.max}
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {students.map((student, index) => {
            const val = marks[student.id] ?? "";
            const numVal = parseFloat(val);
            const isPassing = numVal >= exam.max * 0.4;
            const hasValue = val !== "" && !isNaN(numVal);

            return (
              <div
                key={student.id}
                className="flex items-center gap-4 px-4 py-3
                           hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-mono text-xs text-ink-600 w-6">
                  {index + 1}
                </span>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar name={student.fullName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-100 truncate">
                      {student.fullName}
                    </p>
                    <p className="text-xs text-ink-500">{student.department}</p>
                  </div>
                </div>

                <span
                  className="w-32 font-mono text-sm text-ink-400
                                 text-right shrink-0"
                >
                  {student.rollNo}
                </span>

                {/* Marks input */}
                <div className="w-32 flex justify-end shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={exam.max}
                    value={val}
                    onChange={(e) => setMark(student.id, e.target.value)}
                    placeholder="—"
                    className={`w-20 px-3 py-1.5 rounded-lg text-sm
                                font-mono text-right bg-white/5
                                border transition-all duration-150
                                focus:outline-none focus:bg-white/10 ${
                                  hasValue
                                    ? isPassing
                                      ? "border-jade-500/40 text-jade-300"
                                      : "border-red-500/40 text-red-400"
                                    : "border-white/10 text-ink-300"
                                }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
