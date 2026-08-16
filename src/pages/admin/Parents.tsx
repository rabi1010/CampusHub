import { useState } from "react";
import { Users, Plus, Trash2, Eye } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../Component/ui/DataTable";
import type { Column } from "../../Component/ui/DataTable";
import type { Parent } from "../../services/parentService";
import Badge from "../../Component/ui/Badge";
import Avatar from "../../Component/ui/Avatar";
import { useDeleteParent, useParents } from "@/features/parents/useParents";

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
  const { data: parents = [], isLoading } = useParents();
  const deleteParent = useDeleteParent();

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
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Users size={16} />
            {parents.length} parent{parents.length !== 1 ? "s" : ""} registered
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
    </div>
  );
}