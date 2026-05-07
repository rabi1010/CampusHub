import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useStudents } from "../../features/students/useStudents";
import { useCourses } from "../../features/courses/useCourses";

import type { Student } from "../../services/studentService";
import type { Column } from "../../Component/ui/DataTable";
import Avatar from "../../Component/ui/Avatar";
import Badge from "../../Component/ui/Badge";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../Component/ui/DataTable";

// ── Mock schedule (teacher's assigned courses) ───────────
const MY_COURSES = [
  { id: "1", name: "Data Structures", code: "CS101" },
  { id: "2", name: "Database Systems", code: "CS102" },
  { id: "3", name: "Web Development", code: "IT201" },
];

// ── Table columns — read only, no actions ────────────────
const COLUMNS: Column<Student>[] = [
  {
    key: "fullName",
    label: "Student",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.fullName} size="sm" />
        <div>
          <p className="text-sm font-medium text-ink-100">{row.fullName}</p>
          <p className="text-xs text-ink-500">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "rollNo",
    label: "Roll No",
    sortable: true,
    render: (row) => (
      <span className="font-mono text-sm text-ink-300">{row.rollNo}</span>
    ),
  },
  {
    key: "batch",
    label: "Batch",
    sortable: true,
    render: (row) => (
      <span className="font-mono text-xs text-ink-400">{row.batch}</span>
    ),
  },
  {
    key: "phone",
    label: "Phone",
    render: (row) => <span className="text-sm text-ink-400">{row.phone}</span>,
  },
  {
    key: "status",
    label: "Status",
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

export default function StudentsList() {
  const [selectedCourse, setSelectedCourse] = useState(MY_COURSES[0].id);
  const { data: students = [], isLoading } = useStudents();

  const selected = MY_COURSES.find((c) => c.id === selectedCourse)!;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Students List"
        subtitle="View students enrolled in your courses"
      />

      {/* Course filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {MY_COURSES.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCourse(course.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl
                        text-sm font-medium border transition-all duration-200 ${
                          selectedCourse === course.id
                            ? "bg-jade-500/15 border-jade-500/40 text-jade-300"
                            : "border-white/[0.07] text-ink-400 hover:border-white/20 hover:text-ink-200"
                        }`}
          >
            <BookOpen size={13} />
            {course.name}
            <span className="font-mono text-[10px] opacity-60">
              {course.code}
            </span>
          </button>
        ))}
      </div>

      {/* Student count for selected course */}
      <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-jade-500" />
        <p className="text-sm text-ink-300">
          Showing students enrolled in{" "}
          <span className="text-jade-400 font-medium">{selected.name}</span>
        </p>
        <span className="ml-auto font-mono text-xs text-ink-500">
          {students.length} students
        </span>
      </div>

      <DataTable
        data={students}
        columns={COLUMNS}
        loading={isLoading}
        searchable
        searchKeys={["fullName", "email", "rollNo"]}
        searchPlaceholder="Search students..."
        pageSize={10}
        emptyTitle="No students found"
        emptyDesc="No students are enrolled in this course yet."
      />
    </div>
  );
}
