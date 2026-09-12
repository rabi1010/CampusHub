import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { useDepartments, useBatches } from "../academics/useAcademics";
import { useApproveUser, usePendingUsers } from "./useApprovals";
import type { PendingUser } from "../../services/authService";
import Badge from "../../Component/ui/Badge";
import Modal from "../../Component/ui/Modal";

export default function PendingApprovals() {
  const { data: users = [], isLoading, isError } = usePendingUsers();
  const { data: departments = [] } = useDepartments();
  const { data: batches = [] } = useBatches();
  const approve = useApproveUser();
  const [selected, setSelected] = useState<PendingUser | null>(null);
  const [rollNo, setRollNo] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [qualification, setQualification] = useState("");
  const [studentIds, setStudentIds] = useState("");
  const [relationship, setRelationship] = useState("");
  const [approvalRole, setApprovalRole] = useState<"STUDENT" | "TEACHER" | "PARENT">("STUDENT");

  const openApproval = (user: PendingUser) => {
    setSelected(user);
    setRollNo("");
    setDepartmentId("");
    setBatchId("");
    setEmployeeId("");
    setQualification("");
    setStudentIds("");
    setRelationship("");
    setApprovalRole(user.role === "TEACHER" || user.role === "PARENT" ? user.role : "STUDENT");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    const data = approvalRole === "STUDENT"
      ? { role: "STUDENT" as const, rollNo, departmentId, batchId }
      : approvalRole === "TEACHER"
        ? { role: "TEACHER" as const, employeeId, departmentId, qualification }
        : { role: "PARENT" as const, studentIds: studentIds.split(",").map((id) => id.trim()).filter(Boolean), relationship };
    approve.mutate({ id: selected.id, data },
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
                <Badge label={user.role === "PENDING" ? "ROLE NOT SET" : user.role} variant="warning" />
                <button className="btn-primary px-5 py-2 text-xs" onClick={() => openApproval(user)}>
                  Review and approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={`Approve ${approvalRole.toLowerCase()}`} subtitle={selected?.email}>
        <form className="space-y-4" onSubmit={submit}>
          {selected?.role === "PENDING" && <select className="input-field" value={approvalRole} onChange={(e) => setApprovalRole(e.target.value as typeof approvalRole)}><option value="STUDENT">Student</option><option value="TEACHER">Teacher</option><option value="PARENT">Parent</option></select>}
          {approvalRole === "STUDENT" && <>
            <input className="input-field" placeholder="Roll number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
            <select className="input-field" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required><option value="">Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select>
            <select className="input-field" value={batchId} onChange={(e) => setBatchId(e.target.value)} required><option value="">Select batch</option>{batches.filter((batch) => !departmentId || batch.department?.id === departmentId).map((batch) => <option key={batch.id} value={batch.id}>{batch.name}</option>)}</select>
          </>}
          {approvalRole === "TEACHER" && <>
            <input className="input-field" placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
            <select className="input-field" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required><option value="">Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select>
            <input className="input-field" placeholder="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
          </>}
          {approvalRole === "PARENT" && <>
            <input className="input-field" placeholder="Student IDs, comma separated" value={studentIds} onChange={(e) => setStudentIds(e.target.value)} required />
            <input className="input-field" placeholder="Relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} required />
          </>}
          <button className="btn-primary w-full justify-center py-3" disabled={approve.isPending}>
            {approve.isPending ? "Approving..." : "Approve account"}
          </button>
        </form>
      </Modal>
    </section>
  );
}
