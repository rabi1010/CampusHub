import { useState, type FormEvent } from "react";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../Component/ui/DataTable";
import type { Column } from "../../Component/ui/DataTable";
import type {
  CreateParentPayload,
  Parent,
  UpdateParentPayload,
} from "../../services/parentService";
import Badge from "../../Component/ui/Badge";
import Avatar from "../../Component/ui/Avatar";
import Modal from "../../Component/ui/Modal";
import {
  useCreateParent,
  useDeleteParent,
  useParents,
  useUpdateParent,
} from "@/features/parents/useParents";
import { useStudents } from "@/features/students/useStudents";

const EMPTY_CREATE_FORM: CreateParentPayload = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  relationship: "",
  studentIds: [],
};

const COLUMNS: Column<Parent>[] = [
  {
    key: "fullName",
    label: "Parent",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3 py-1">
        <Avatar name={row.fullName} size="md" />
        <div>
          <p className="text-zinc-900 font-medium text-sm">{row.fullName}</p>
          <p className="text-[11px] text-zinc-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "relationship",
    label: "Relationship",
    render: (row) => (
      <span className="text-sm text-zinc-600">
        {row.relationship ?? "—"}
      </span>
    ),
  },
  {
    key: "children",
    label: "Children",
    render: (row) => (
      <div className="flex flex-col gap-1">
        {row.children && row.children.length > 0 ? (
          row.children.map((child) => (
            <div key={child.id} className="flex items-center gap-1.5">
              <span className="text-xs font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">
                {child.rollNo}
              </span>
              <span className="text-xs text-zinc-500">
                {child.user?.fullName}
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-zinc-400">No children linked</span>
        )}
      </div>
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

export default function Parents() {
  const [addOpen, setAddOpen] = useState(false);
  const [editParent, setEditParent] = useState<Parent | null>(null);
  const [createForm, setCreateForm] = useState<CreateParentPayload>(EMPTY_CREATE_FORM);
  const [editForm, setEditForm] = useState<UpdateParentPayload>({});
  const { data: parents = [], isLoading } = useParents();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const createParent = useCreateParent();
  const updateParent = useUpdateParent();
  const deleteParent = useDeleteParent();

  const selectedStudentIds = (options: HTMLCollectionOf<HTMLOptionElement>) =>
    Array.from(options, (option) => option.value);

  const openEdit = (parent: Parent) => {
    setEditParent(parent);
    setEditForm({
      fullName: parent.fullName,
      phone: parent.phone ?? "",
      relationship: parent.relationship ?? "",
      studentIds: parent.children?.map((child) => child.id) ?? [],
    });
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!createForm.fullName.trim() || !createForm.email.trim() || !createForm.password) return;

    createParent.mutate(createForm, {
      onSuccess: () => {
        setAddOpen(false);
        setCreateForm(EMPTY_CREATE_FORM);
      },
    });
  };

  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editParent) return;

    updateParent.mutate(
      { id: editParent.id, data: editForm },
      { onSuccess: () => setEditParent(null) },
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this parent?")) {
      deleteParent.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Parent Management"
        subtitle="Manage guardian accounts and their linked children."
        action={
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500">
              <Users size={16} />
              {parents.length} parent{parents.length !== 1 ? "s" : ""} registered
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="btn-primary"
            >
              <Plus size={17} />
              Add Parent
            </button>
          </div>
        }
      />

      <div className="card-base bg-white overflow-hidden border border-zinc-100 shadow-sm">
        <DataTable
          data={parents}
          columns={COLUMNS}
          loading={isLoading}
          searchable={true}
          searchKeys={["fullName", "email"]}
          pageSize={10}
          emptyTitle="No Parents Registered"
          emptyDesc="Parents register themselves or are created by admin with child links."
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEdit(row)}
                className="p-1.5 text-zinc-400 hover:text-brand-600 transition-colors"
                title="Edit parent"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                title="Delete parent"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        />
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Parent"
        subtitle="Create a guardian account and link students."
        size="lg"
      >
        <form className="space-y-5" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-sm font-medium text-zinc-700">
              Full name
              <input
                className="input-field"
                value={createForm.fullName}
                onChange={(event) => setCreateForm({ ...createForm, fullName: event.target.value })}
                required
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-700">
              Email
              <input
                className="input-field"
                type="email"
                value={createForm.email}
                onChange={(event) => setCreateForm({ ...createForm, email: event.target.value })}
                required
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-700">
              Password
              <input
                className="input-field"
                type="password"
                value={createForm.password}
                onChange={(event) => setCreateForm({ ...createForm, password: event.target.value })}
                required
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-700">
              Phone
              <input
                className="input-field"
                type="tel"
                value={createForm.phone}
                onChange={(event) => setCreateForm({ ...createForm, phone: event.target.value })}
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-700 sm:col-span-2">
              Relationship
              <input
                className="input-field"
                value={createForm.relationship}
                onChange={(event) => setCreateForm({ ...createForm, relationship: event.target.value })}
                placeholder="e.g. Father, Mother, Guardian"
              />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            Students
            <select
              multiple
              className="input-field min-h-36"
              value={createForm.studentIds}
              onChange={(event) =>
                setCreateForm({
                  ...createForm,
                  studentIds: selectedStudentIds(event.target.selectedOptions),
                })
              }
              disabled={studentsLoading}
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName} ({student.rollNo})
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={createParent.isPending}>
              {createParent.isPending ? "Creating..." : "Create Parent"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editParent}
        onClose={() => setEditParent(null)}
        title="Edit Parent"
        subtitle={`Update details and student links for ${editParent?.fullName ?? "this parent"}.`}
        size="lg"
      >
        <form className="space-y-5" onSubmit={handleEdit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-sm font-medium text-zinc-700 sm:col-span-2">
              Full name
              <input
                className="input-field"
                value={editForm.fullName ?? ""}
                onChange={(event) => setEditForm({ ...editForm, fullName: event.target.value })}
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-700">
              Phone
              <input
                className="input-field"
                type="tel"
                value={editForm.phone ?? ""}
                onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })}
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-zinc-700">
              Relationship
              <input
                className="input-field"
                value={editForm.relationship ?? ""}
                onChange={(event) => setEditForm({ ...editForm, relationship: event.target.value })}
              />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            Students
            <select
              multiple
              className="input-field min-h-36"
              value={editForm.studentIds ?? []}
              onChange={(event) =>
                setEditForm({
                  ...editForm,
                  studentIds: selectedStudentIds(event.target.selectedOptions),
                })
              }
              disabled={studentsLoading}
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName} ({student.rollNo})
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setEditParent(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={updateParent.isPending}>
              {updateParent.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
