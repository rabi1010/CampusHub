import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { useDepartments, useBatches } from "../academics/useAcademics";
import { useApproveStudent, usePendingUsers } from "./useApprovals";
import type { PendingUser } from "../../services/authService";
import Badge from "../../Component/ui/Badge";
import Modal from "../../Component/ui/Modal";

export default function PendingApprovals() {
  const { data: users = [], isLoading, isError } = usePendingUsers();
  const { data: departments = [] } = useDepartments();
  const { data: batches = [] } = useBatches();
  const approve = useApproveStudent();
  const [selected, setSelected] = useState<PendingUser | null>(null);
  const [rollNo, setRollNo] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [batchId, setBatchId] = useState("");

  const openApproval = (user: PendingUser) => {
    setSelected(user);
    setRollNo("");
    setDepartmentId("");
    setBatchId("");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    approve.mutate(
      {
        id: selected.id,
        data: { role: "STUDENT", rollNo, departmentId, batchId },
      },
      { onSuccess: () => setSelected(null) },
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="flex items-center gap-2 text-xl font-medium text-zinc-900">
          <Clock size={20} className="text-amber-500" /> Pending Approvals
        </h2>
        <Badge label={`${users.length} pending`} variant={users.length ? "warning" : "success"} />
      </div>

      <div className="card-base overflow-hidden border-zinc-100 bg-white">
        {isLoading ? (
          <div className="p-8 text-sm text-zinc-500">Loading pending users...</div>
        ) : isError ? (
          <div className="p-8 text-sm text-rose-600">Pending users could not be loaded.</div>
        ) : users.length === 0 ? (
          <div className="flex items-center gap-3 p-8 text-sm text-zinc-500">
            <CheckCircle2 className="text-emerald-500" size={20} /> No accounts are waiting for approval.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-900">{user.fullName}</p>
                  <p className="truncate text-sm text-zinc-500">{user.email}</p>
                </div>
                <Badge label={user.role} variant="warning" />
                {user.role === "STUDENT" ? (
                  <button className="btn-primary px-5 py-2 text-xs" onClick={() => openApproval(user)}>
                    Review and approve
                  </button>
                ) : (
                  <span className="text-xs text-zinc-400">Approval fields are not documented for this role.</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Approve student" subtitle={selected?.email}>
        <form className="space-y-4" onSubmit={submit}>
          <input className="input-field" placeholder="Roll number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
          <select className="input-field" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required>
            <option value="">Select department</option>
            {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
          </select>
          <select className="input-field" value={batchId} onChange={(e) => setBatchId(e.target.value)} required>
            <option value="">Select batch</option>
            {batches.filter((batch) => !departmentId || batch.department?.id === departmentId).map((batch) => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
          </select>
          <button className="btn-primary w-full justify-center py-3" disabled={approve.isPending}>
            {approve.isPending ? "Approving..." : "Approve account"}
          </button>
        </form>
      </Modal>
    </section>
  );
}
