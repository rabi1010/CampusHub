import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
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
import Badge from "../../Component/ui/Badge";
import DataTable from "../../Component/ui/DataTable";
import Modal from "../../Component/ui/Modal";
import CourseForm from "../../features/courses/CourseForm";
import ConfirmDialog from "../../Component/ui/ConfirmDialog";

// ── Table columns ────────────────────────────────────────
const COLUMNS: Column<Course>[] = [
  {
    key: "name",
    label: "Course",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        {/* Course icon instead of avatar */}
        <div
          className="w-8 h-8 rounded-lg bg-gold-500/10
                        border border-gold-500/20
                        flex items-center justify-center shrink-0"
        >
          <BookOpen size={14} className="text-gold-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-100">{row.name}</p>
          <p className="text-xs text-ink-500">
            {row.description.slice(0, 40)}...
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "code",
    label: "Code",
    sortable: true,
    render: (row) => (
      <span className="font-mono text-sm font-medium text-jade-400">
        {row.code}
      </span>
    ),
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
    render: (row) => (
      <span className="text-sm text-ink-300">{row.department}</span>
    ),
  },
  {
    key: "semester",
    label: "Sem",
    render: (row) => (
      <span className="font-mono text-sm text-ink-400">Sem {row.semester}</span>
    ),
  },
  {
    key: "credits",
    label: "Credits",
    render: (row) => (
      <span className="font-mono text-sm text-ink-400">{row.credits} cr</span>
    ),
  },
  {
    key: "enrolledCount",
    label: "Enrolled",
    render: (row) => (
      <span className="font-mono text-sm text-ink-300">
        {row.enrolledCount}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge
        label={row.status}
        variant={row.status === "ACTIVE" ? "success" : "default"}
      />
    ),
  },
];

// ── Component ────────────────────────────────────────────
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
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Courses"
        subtitle={`${courses.length} courses available`}
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={16} />
            Add course
          </button>
        }
      />

      <DataTable
        data={courses}
        columns={COLUMNS}
        loading={isLoading}
        searchable
        searchKeys={["name", "code", "department"]}
        searchPlaceholder="Search by name, code or department..."
        pageSize={10}
        emptyTitle="No courses found"
        emptyDesc="Add your first course using the button above."
        actions={(row) => (
          <>
            <button
              onClick={() => setEditCourse(row)}
              className="p-1.5 rounded-lg text-ink-500
                         hover:text-jade-400 hover:bg-jade-500/10
                         transition-colors"
              title="Edit course"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setDeleteTarget(row)}
              className="p-1.5 rounded-lg text-ink-500
                         hover:text-red-400 hover:bg-red-500/10
                         transition-colors"
              title="Delete course"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      />

      {/* Add modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add new course"
        subtitle="Create a new course for a department"
        size="lg"
      >
        <CourseForm onSubmit={handleAdd} isLoading={createCourse.isPending} />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editCourse}
        onClose={() => setEditCourse(null)}
        title="Edit course"
        subtitle={`Editing ${editCourse?.name ?? ""}`}
        size="lg"
      >
        {editCourse && (
          <CourseForm
            course={editCourse}
            onSubmit={handleEdit}
            isLoading={updateCourse.isPending}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete course"
        description={`Are you sure you want to delete "${deleteTarget?.name ?? "this course"}"? All enrollments will be affected.`}
        confirmLabel="Delete course"
        loading={deleteCourse.isPending}
      />
    </div>
  );
}
