import { useState } from "react";
import { UserPlus, Pencil, Trash2, Filter, Hash, Layers } from "lucide-react";
import { motion } from "framer-motion";
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

const COLUMNS: Column<Student>[] = [
  {
    key: "fullName",
    label: "Student Profile",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-4 py-1">
        <Avatar name={row.fullName} size="md" className="shadow-sm border-2 border-white ring-1 ring-slate-100" />
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
    key: "department",
    label: "Department",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Layers size={14} className="text-slate-300" />
        {row.department}
      </div>
    ),
  },
  {
    key: "batch",
    label: "Academic Year",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 px-2 py-0.5 rounded border border-slate-50">
        Batch {row.batch}
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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageHeader
          title="Student Registry"
          subtitle={`Actively managing ${students.length} institutional academic profiles.`}
          action={
            <button
              onClick={() => setAddOpen(true)}
              className="btn-primary py-3.5 px-8 shadow-xl shadow-brand-500/15"
            >
              <UserPlus size={18} />
              Enroll Student
            </button>
          }
        />
      </motion.div>

      <div className="card-base bg-white border-slate-100 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
              <Filter size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Filter Analytics</p>
              <p className="text-xs font-bold text-slate-600">Showing all records from the current semester.</p>
            </div>
          </div>
        </div>

        <DataTable
          data={students}
          columns={COLUMNS}
          loading={isLoading}
          searchable
          searchKeys={["fullName", "email", "rollNo", "department"]}
          searchPlaceholder="Filter registry by name, roll no, or curriculum department..."
          pageSize={10}
          emptyTitle="Registry is Empty"
          emptyDesc="No student records were found matching your current parameters."
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditStudent(row)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100"
                title="Modify Record"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                title="Purge Record"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Student Enrollment"
        subtitle="Complete the primary registration form to initialize a student record."
        size="lg"
      >
        <div className="p-4">
          <StudentForm onSubmit={handleAdd} isLoading={createStudent.isPending} />
        </div>
      </Modal>

      <Modal
        open={!!editStudent}
        onClose={() => setEditStudent(null)}
        title="Record Modification"
        subtitle={`Updating academic credentials for ${editStudent?.fullName}`}
        size="lg"
      >
        <div className="p-4">
          {editStudent && (
            <StudentForm
              student={editStudent}
              onSubmit={handleEdit}
              isLoading={updateStudent.isPending}
            />
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Institutional Record Deletion"
        description={`You are about to permanently purge the student record for ${deleteTarget?.fullName}. This operation will invalidate all associated academic history and cannot be reversed.`}
        confirmLabel="Execute Deletion"
        loading={deleteStudent.isPending}
      />
    </div>
  );
}
