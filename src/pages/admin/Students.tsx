import { useState } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "../../features/students/useStudents";
import PageHeader from "../../components/ui/PageHeader";
import type { Student } from "../../services/studentService";
import type {
  StudentEditFormValues,
  StudentFormValues,
} from "../../features/students/studentSchemas";
import type { Column } from "../../Component/ui/DataTable";
import Avatar from "../../Component/ui/Avatar";
import Badge from "../../Component/ui/Badge";
import DataTable from "../../Component/ui/DataTable";
import Modal from "../../Component/ui/Modal";
import StudentForm from "../../features/students/StudentForm";
import ConfirmDialog from "../../Component/ui/ConfirmDialog";

// ── ID lookup maps ───────────────────────────────────────
const DEPARTMENT_MAP: Record<string, number> = {
  "Computer Science": 1,
  "Information Technology": 2,
  Electronics: 3,
  "Civil Engineering": 4,
  "Mechanical Engineering": 5,
};

const BATCH_MAP: Record<string, number> = {
  "2021-2024": 1,
  "2022-2025": 2,
  "2023-2026": 3,
  "2024-2027": 4,
};

// ── Table column definitions ─────────────────────────────
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
    key: "department",
    label: "Department",
    sortable: true,
    render: (row) => (
      <span className="text-sm text-ink-300">{row.department}</span>
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

// ── Component ────────────────────────────────────────────
export default function Students() {
  const [addOpen, setAddOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const { data: students = [], isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const handleAdd = (data: StudentFormValues | StudentEditFormValues) => {
    createStudent.mutate(data as StudentFormValues, {
      onSuccess: () => setAddOpen(false),
    });
  };

  const handleEdit = (data: StudentFormValues | StudentEditFormValues) => {
    if (!editStudent) return;
    updateStudent.mutate(
      { id: editStudent.id, data },
      { onSuccess: () => setEditStudent(null) },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteStudent.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Students"
        subtitle={`${students.length} students enrolled`}
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <UserPlus size={16} />
            Add student
          </button>
        }
      />

      <DataTable
        data={students}
        columns={COLUMNS}
        loading={isLoading}
        searchable
        searchKeys={["fullName", "email", "rollNo", "department"]}
        searchPlaceholder="Search by name, email, roll no..."
        pageSize={10}
        emptyTitle="No students found"
        emptyDesc="Add your first student using the button above."
        actions={(row) => (
          <>
            <button
              onClick={() => setEditStudent(row)}
              className="p-1.5 rounded-lg text-ink-500 hover:text-jade-400
                         hover:bg-jade-500/10 transition-colors"
              title="Edit student"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setDeleteTarget(row)}
              className="p-1.5 rounded-lg text-ink-500 hover:text-red-400
                         hover:bg-red-500/10 transition-colors"
              title="Delete student"
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
        title="Add new student"
        subtitle="Fill in the details to register a new student"
        size="lg"
      >
        <StudentForm onSubmit={handleAdd} isLoading={createStudent.isPending} />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editStudent}
        onClose={() => setEditStudent(null)}
        title="Edit student"
        subtitle={`Editing ${editStudent?.fullName ?? ""}`}
        size="lg"
      >
        {editStudent && (
          <StudentForm
            student={editStudent}
            onSubmit={handleEdit}
            isLoading={updateStudent.isPending}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete student"
        description={`Are you sure you want to delete ${deleteTarget?.fullName ?? "this student"}? This action cannot be undone.`}
        confirmLabel="Delete student"
        loading={deleteStudent.isPending}
      />
    </div>
  );
}
