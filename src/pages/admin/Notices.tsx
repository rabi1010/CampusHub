import { useState } from "react";
import { Plus, Pencil, Trash2, Bell } from "lucide-react";
import {
  useNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
} from "../../features/notices/useNotices";
import PageHeader from "../../components/ui/PageHeader";

import type { Notice } from "../../services/noticeService";
import type { NoticeFormValues } from "../../features/notices/noticeSchemas";
import clsx from "clsx";
import type { Column } from "../../Component/ui/DataTable";
import Badge from "../../Component/ui/Badge";
import DataTable from "../../Component/ui/DataTable";
import Modal from "../../Component/ui/Modal";
import NoticeForm from "../../features/notices/NoticeForm";
import ConfirmDialog from "../../Component/ui/ConfirmDialog";

// ── Table columns ────────────────────────────────────────
const COLUMNS: Column<Notice>[] = [
  {
    key: "title",
    label: "Notice",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            row.urgent
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-jade-500/10 border border-jade-500/20",
          )}
        >
          <Bell
            size={14}
            className={row.urgent ? "text-red-400" : "text-jade-400"}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-ink-100">{row.title}</p>
            {row.urgent && (
              <span
                className="text-[10px] font-mono font-medium
                               bg-red-500/15 text-red-400
                               border border-red-500/20
                               px-1.5 py-0.5 rounded-full"
              >
                URGENT
              </span>
            )}
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            {row.content.slice(0, 50)}...
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "forRole",
    label: "Audience",
    render: (row) => (
      <Badge
        label={
          row.forRole === "ALL"
            ? "Everyone"
            : row.forRole === "STUDENT"
              ? "Students"
              : "Teachers"
        }
        variant={
          row.forRole === "ALL"
            ? "info"
            : row.forRole === "STUDENT"
              ? "success"
              : "warning"
        }
      />
    ),
  },
  {
    key: "author",
    label: "Posted by",
    sortable: true,
    render: (row) => <span className="text-sm text-ink-400">{row.author}</span>,
  },
  {
    key: "createdAt",
    label: "Date",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-mono text-ink-500">
        {new Date(row.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
];

// ── Component ────────────────────────────────────────────
export default function Notices() {
  const [addOpen, setAddOpen] = useState(false);
  const [editNotice, setEditNotice] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const { data: notices = [], isLoading } = useNotices();
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const deleteNotice = useDeleteNotice();

  const handleAdd = (data: NoticeFormValues) => {
    createNotice.mutate(data, {
      onSuccess: () => setAddOpen(false),
    });
  };

  const handleEdit = (data: NoticeFormValues) => {
    if (!editNotice) return;
    updateNotice.mutate(
      { id: editNotice.id, data },
      { onSuccess: () => setEditNotice(null) },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteNotice.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  // Urgent notices count for header subtitle
  const urgentCount = notices.filter((n) => n.urgent).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manage Notices"
        subtitle={`${notices.length} notices · ${urgentCount} urgent`}
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={16} />
            Post notice
          </button>
        }
      />

      <DataTable
        data={notices}
        columns={COLUMNS}
        loading={isLoading}
        searchable
        searchKeys={["title", "content", "author"]}
        searchPlaceholder="Search notices..."
        pageSize={10}
        emptyTitle="No notices posted"
        emptyDesc="Post your first notice using the button above."
        actions={(row) => (
          <>
            <button
              onClick={() => setEditNotice(row)}
              className="p-1.5 rounded-lg text-ink-500
                         hover:text-jade-400 hover:bg-jade-500/10
                         transition-colors"
              title="Edit notice"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setDeleteTarget(row)}
              className="p-1.5 rounded-lg text-ink-500
                         hover:text-red-400 hover:bg-red-500/10
                         transition-colors"
              title="Delete notice"
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
        title="Post new notice"
        subtitle="This will be visible to the selected audience immediately"
        size="md"
      >
        <NoticeForm onSubmit={handleAdd} isLoading={createNotice.isPending} />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editNotice}
        onClose={() => setEditNotice(null)}
        title="Edit notice"
        subtitle={`Editing "${editNotice?.title ?? ""}"`}
        size="md"
      >
        {editNotice && (
          <NoticeForm
            notice={editNotice}
            onSubmit={handleEdit}
            isLoading={updateNotice.isPending}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete notice"
        description={`Are you sure you want to delete "${deleteTarget?.title ?? "this notice"}"? It will be removed for all users immediately.`}
        confirmLabel="Delete notice"
        loading={deleteNotice.isPending}
      />
    </div>
  );
}
