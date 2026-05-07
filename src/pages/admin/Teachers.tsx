import { useState } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from "../../features/teachers/useTeachers";
import PageHeader from "../../components/ui/PageHeader";

import type { Teacher } from "../../services/teacherService";
import type {
  TeacherFormValues,
  TeacherEditFormValues,
} from "../../features/teachers/teacherSchemas";
import Avatar from "../../Component/ui/Avatar";
import type { Column } from "../../Component/ui/DataTable";
import Badge from "../../Component/ui/Badge";
import DataTable from "../../Component/ui/DataTable";
import Modal from "../../Component/ui/Modal";
import TeacherForm from "../../features/teachers/TeacherForm";
import ConfirmDialog from "../../Component/ui/ConfirmDialog";

// ── Table columns ────────────────────────────────────────
const COLUMNS: Column<Teacher>[] = [
  {
    key: "fullName",
    label: "Teacher",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.fullName} size="sm" color="ink" />
        <div>
          <p className="text-sm font-medium text-ink-100">{row.fullName}</p>
          <p className="text-xs text-ink-500">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "employeeId",
    label: "Employee ID",
    sortable: true,
    render: (row) => (
      <span className="font-mono text-sm text-ink-300">{row.employeeId}</span>
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
    key: "qualification",
    label: "Qualification",
    sortable: true,
    render: (row) => (
      <span className="text-sm text-ink-400">{row.qualification}</span>
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
export default function Teachers() {
  const [addOpen, setAddOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);

  const { data: teachers = [], isLoading } = useTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  const handleAdd = (data: TeacherFormValues | TeacherEditFormValues) => {
    createTeacher.mutate(data as TeacherFormValues, {
      onSuccess: () => setAddOpen(false),
    });
  };

  const handleEdit = (data: TeacherFormValues | TeacherEditFormValues) => {
    if (!editTeacher) return;
    updateTeacher.mutate(
      { id: editTeacher.id, data },
      { onSuccess: () => setEditTeacher(null) },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTeacher.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Teachers"
        subtitle={`${teachers.length} teachers registered`}
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <UserPlus size={16} />
            Add teacher
          </button>
        }
      />

      <DataTable
        data={teachers}
        columns={COLUMNS}
        loading={isLoading}
        searchable
        searchKeys={["fullName", "email", "employeeId", "department"]}
        searchPlaceholder="Search by name, email, employee ID..."
        pageSize={10}
        emptyTitle="No teachers found"
        emptyDesc="Add your first teacher using the button above."
        actions={(row) => (
          <>
            <button
              onClick={() => setEditTeacher(row)}
              className="p-1.5 rounded-lg text-ink-500
                         hover:text-jade-400 hover:bg-jade-500/10
                         transition-colors"
              title="Edit teacher"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setDeleteTarget(row)}
              className="p-1.5 rounded-lg text-ink-500
                         hover:text-red-400 hover:bg-red-500/10
                         transition-colors"
              title="Delete teacher"
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
        title="Add new teacher"
        subtitle="Fill in the details to register a new teacher"
        size="lg"
      >
        <TeacherForm onSubmit={handleAdd} isLoading={createTeacher.isPending} />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editTeacher}
        onClose={() => setEditTeacher(null)}
        title="Edit teacher"
        subtitle={`Editing ${editTeacher?.fullName ?? ""}`}
        size="lg"
      >
        {editTeacher && (
          <TeacherForm
            teacher={editTeacher}
            onSubmit={handleEdit}
            isLoading={updateTeacher.isPending}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete teacher"
        description={`Are you sure you want to delete ${deleteTarget?.fullName ?? "this teacher"}? This action cannot be undone.`}
        confirmLabel="Delete teacher"
        loading={deleteTeacher.isPending}
      />
    </div>
  );
}
