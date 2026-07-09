import { useState } from "react";
import { UserPlus, Pencil, Trash2, ShieldCheck, Briefcase, GraduationCap, ChevronRight, Search as SearchIcon, Filter } from "lucide-react";
import { motion } from "framer-motion";
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
    label: "Faculty Profile",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-4 py-1">
        <Avatar name={row.fullName} size="md" className="shadow-sm border-2 border-white ring-1 ring-zinc-100" />
        <div>
          <p className="text-sm font-medium text-zinc-900 leading-tight">{row.fullName}</p>
          <p className="text-[11px] font-medium text-zinc-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "employeeId",
    label: "Employee Index",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 font-mono text-[11px] font-medium text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
        <ShieldCheck size={12} className="text-brand-500" />
        {row.employeeId}
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
        <Briefcase size={14} className="text-zinc-300" />
        {row.department}
      </div>
    ),
  },
  {
    key: "qualification",
    label: "Academic Credentials",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400 uppercase tracking-widest bg-zinc-50/50 px-2 py-0.5 rounded border border-zinc-50">
        <GraduationCap size={14} className="text-zinc-300" />
        {row.qualification}
      </div>
    ),
  },
  {
    key: "status",
    label: "Account Status",
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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageHeader
          title="Faculty Directory"
          subtitle={`Coordinating ${teachers.length} academic professionals across all departments.`}
          action={
            <button 
              onClick={() => setAddOpen(true)} 
              className="btn-primary py-3.5 px-8 shadow-xl shadow-brand-500/15"
            >
              <UserPlus size={18} />
              Register Faculty
            </button>
          }
        />
      </motion.div>

      <div className="card-base bg-white border-zinc-100 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-50 bg-zinc-50/30 flex flex-col sm:flex-row justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400">
                 <Filter size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em] mb-0.5">Faculty Analytics</p>
                 <p className="text-xs font-medium text-zinc-600">Reviewing institutional staffing and credentials.</p>
              </div>
           </div>
        </div>

        <DataTable
          data={teachers}
          columns={COLUMNS}
          loading={isLoading}
          searchable
          searchKeys={["fullName", "email", "employeeId", "department"]}
          searchPlaceholder="Filter directory by member name, employee index or department..."
          pageSize={10}
          emptyTitle="Directory is Empty"
          emptyDesc="No faculty members were found matching your current parameters."
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditTeacher(row)}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100"
                title="Modify Profile"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                title="Purge Record"
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
        title="Faculty Registration"
        subtitle="Initialize academic credentials to register a new faculty member."
        size="lg"
      >
        <div className="p-4">
          <TeacherForm onSubmit={handleAdd} isLoading={createTeacher.isPending} />
        </div>
      </Modal>

      <Modal
        open={!!editTeacher}
        onClose={() => setEditTeacher(null)}
        title="Credential Update"
        subtitle={`Modifying faculty record and department assignments for ${editTeacher?.fullName}`}
        size="lg"
      >
        <div className="p-4">
          {editTeacher && (
            <TeacherForm
              teacher={editTeacher}
              onSubmit={handleEdit}
              isLoading={updateTeacher.isPending}
            />
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Institutional Faculty Deletion"
        description={`You are about to permanently purge ${deleteTarget?.fullName} from the institutional directory. This will invalidate all associated course assignments and staffing history.`}
        confirmLabel="Execute Deletion"
        loading={deleteTeacher.isPending}
      />
    </div>
  );
}
