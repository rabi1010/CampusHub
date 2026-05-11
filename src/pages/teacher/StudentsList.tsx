import { useState } from "react";
import { BookOpen, GraduationCap, Phone, Hash, Layers, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useStudents } from "../../features/students/useStudents";
import { useCourses } from "../../features/courses/useCourses";

import type { Student } from "../../services/studentService";
import type { Column } from "../../Component/ui/DataTable";
import Avatar from "../../Component/ui/Avatar";
import Badge from "../../Component/ui/Badge";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../Component/ui/DataTable";
import clsx from "clsx";

const MY_COURSES = [
  { id: "1", name: "Data Structures", code: "CS101" },
  { id: "2", name: "Database Systems", code: "CS102" },
  { id: "3", name: "Web Development", code: "IT201" },
];

const COLUMNS: Column<Student>[] = [
  {
    key: "fullName",
    label: "Student Profile",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-4 py-1">
        <Avatar name={row.fullName} size="md" className="border-2 border-white shadow-sm ring-1 ring-slate-100" />
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">{row.fullName}</p>
          <p className="text-[11px] font-medium text-slate-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "rollNo",
    label: "Roll Number",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
        <Hash size={12} className="text-brand-500" />
        {row.rollNo}
      </div>
    ),
  },
  {
    key: "batch",
    label: "Academic Year",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Layers size={14} className="text-slate-300" />
        Batch {row.batch}
      </div>
    ),
  },
  {
    key: "phone",
    label: "Contact",
    render: (row) => (
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Phone size={14} className="text-slate-400" />
        {row.phone}
      </div>
    ),
  },
  {
    key: "status",
    label: "Current Status",
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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageHeader
          title="Student Registry"
          subtitle="Directory of students enrolled in your academic modules."
        />
      </motion.div>

      {/* Course filter pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {MY_COURSES.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCourse(course.id)}
            className={clsx(
              "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
              selectedCourse === course.id
                ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/20"
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
            )}
          >
            <BookOpen size={16} />
            {course.name}
            <span className={clsx("text-[10px] ml-1 px-1.5 py-0.5 rounded-md font-mono", selectedCourse === course.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400")}>
              {course.code}
            </span>
          </button>
        ))}
      </div>

      {/* Summary indicator */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm"
      >
        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
          <GraduationCap size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active Enrollment</p>
          <p className="text-sm font-bold text-slate-900">
            Showing roster for <span className="text-brand-600">{selected.name}</span>
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <Users size={16} className="text-slate-400" />
          <span className="font-mono text-sm font-bold text-slate-600">{students.length} Total</span>
        </div>
      </motion.div>

      <div className="card-base bg-white border-slate-100 overflow-hidden shadow-sm">
        <DataTable
          data={students}
          columns={COLUMNS}
          loading={isLoading}
          searchable
          searchKeys={["fullName", "email", "rollNo"]}
          searchPlaceholder="Filter roster by name, email or roll number..."
          pageSize={10}
          emptyTitle="Registry is Empty"
          emptyDesc="No students are currently enrolled in this curriculum module."
        />
      </div>
    </div>
  );
}
