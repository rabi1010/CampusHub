import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, Layers, Hash } from "lucide-react";
import { motion } from "framer-motion";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "../../features/courses/useCourses";
import PageHeader from "../../components/ui/PageHeader";

import type { Course } from "../../services/courseService";
import type { CourseFormValues } from "../../features/courses/courseSchemas";
import type { Column } from "../../Component/ui/DataTable";
import DataTable from "../../Component/ui/DataTable";
import Modal from "../../Component/ui/Modal";
import CourseForm from "../../features/courses/CourseForm";
import ConfirmDialog from "../../Component/ui/ConfirmDialog";

// ── Table columns ────────────────────────────────────────
const COLUMNS: Column<Course>[] = [
  {
    key: "name",
    label: "Curriculum Item",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-4 py-1">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
          <BookOpen size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900 leading-tight truncate">{row.name}</p>
          <p className="text-[11px] font-medium text-zinc-400 mt-0.5 truncate max-w-[200px]">
            {row.description}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "code",
    label: "Course Code",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 font-mono text-[11px] font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
        <Hash size={12} />
        {row.code}
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
        <Layers size={14} className="text-zinc-400" />
        {row.department?.name ?? "Unassigned"}
      </div>
    ),
  },
  {
    key: "semester",
    label: "Level",
    render: (row) => (
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
        Semester {row.semester}
      </span>
    ),
  },
  {
    key: "credits",
    label: "Units",
    render: (row) => (
      <div className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-medium text-[10px] inline-block border border-zinc-200">
        {row.credits} CREDITS
      </div>
    ),
  },
];

export default function Courses() {
  const [addOpen, setAddOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const { data: courses = [], isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const handleAdd = (data: CourseFormValues) => {
    createCourse.mutate(data, {
      onSuccess: () => setAddOpen(false),
    });
  };

  const handleEdit = (data: CourseFormValues) => {
    if (!editCourse) return;
    updateCourse.mutate(
      { id: editCourse.id, data },
      { onSuccess: () => setEditCourse(null) },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCourse.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageHeader
          title="Course Management"
          subtitle={`${courses.length} educational programs currently defined`}
          action={
            <button 
              onClick={() => setAddOpen(true)} 
              className="btn-primary py-3 px-6 shadow-brand-500/10"
            >
              <Plus size={18} />
              Design New Course
            </button>
          }
        />
      </motion.div>

      <div className="card-base bg-white border-zinc-100 overflow-hidden">
        <DataTable
          data={courses}
          columns={COLUMNS}
          loading={isLoading}
          searchable
          searchKeys={["name", "code"]}
          searchPlaceholder="Filter catalog by name or code..."
          pageSize={10}
          emptyTitle="Catalog is Empty"
          emptyDesc="No courses found. Create a new curriculum item to begin."
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditCourse(row)}
                className="p-2 rounded-xl text-zinc-400 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100"
                title="Edit Course"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                title="Delete Course"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>

      {/* Modals & Dialogs */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Course Designer"
        subtitle="Specify academic requirements and unit structure"
        size="lg"
      >
        <div className="p-2">
          <CourseForm onSubmit={handleAdd} isLoading={createCourse.isPending} />
        </div>
      </Modal>

      <Modal
        open={!!editCourse}
        onClose={() => setEditCourse(null)}
        title="Modify Curriculum"
        subtitle={`Editing requirements for: ${editCourse?.name}`}
        size="lg"
      >
        <div className="p-2">
          {editCourse && (
            <CourseForm
              course={editCourse}
              onSubmit={handleEdit}
              isLoading={updateCourse.isPending}
            />
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Curriculum Item"
        description={`This will permanently remove "${deleteTarget?.name}" from the catalog. This action may affect existing student enrollments.`}
        confirmLabel="Confirm Deletion"
        loading={deleteCourse.isPending}
      />
    </div>
  );
}
