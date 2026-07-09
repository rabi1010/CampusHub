import { useState } from "react";
import { Plus, Pencil, Trash2, Bell, Megaphone, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
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
    label: "Bulletin Update",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-4 py-1">
        <div className={clsx(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-all",
          row.urgent 
            ? "bg-rose-50 border-rose-100 text-rose-600" 
            : "bg-brand-50 border-brand-100 text-brand-600"
        )}>
          {row.urgent ? <Megaphone size={18} /> : <Bell size={18} />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-zinc-900 truncate">{row.title}</p>
            {row.urgent && (
              <span className="text-[9px] font-medium bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                Urgent
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 font-medium truncate max-w-[200px]">
            {row.content}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "forRole",
    label: "Target Audience",
    render: (row) => (
      <Badge
        label={
          row.forRole === "ALL"
            ? "Public"
            : row.forRole === "STUDENT"
              ? "Students"
              : "Faculty"
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
    label: "Publisher",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-zinc-600 font-medium text-sm">
        <User size={14} className="text-zinc-400" />
        {row.author}
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Publication Date",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
        <Calendar size={12} />
        {new Date(row.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    ),
  },
];

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

  const urgentCount = notices.filter((n) => n.urgent).length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageHeader
          title="Campus Bulletin"
          subtitle={`${notices.length} active announcements · ${urgentCount} flagged as urgent`}
          action={
            <button 
              onClick={() => setAddOpen(true)} 
              className="btn-primary py-3 px-6 shadow-brand-500/10"
            >
              <Plus size={18} />
              Create Announcement
            </button>
          }
        />
      </motion.div>

      <div className="card-base bg-white border-zinc-100 overflow-hidden">
        <DataTable
          data={notices}
          columns={COLUMNS}
          loading={isLoading}
          searchable
          searchKeys={["title", "content", "author"]}
          searchPlaceholder="Filter announcements by title, content or publisher..."
          pageSize={10}
          emptyTitle="No Announcements Found"
          emptyDesc="The bulletin is currently empty. Create a notice to inform the campus."
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditNotice(row)}
                className="p-2 rounded-xl text-zinc-400 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100"
                title="Edit Announcement"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                title="Delete Announcement"
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
        title="Post Announcement"
        subtitle="Inform students and faculty about important updates"
        size="md"
      >
        <div className="p-2">
          <NoticeForm onSubmit={handleAdd} isLoading={createNotice.isPending} />
        </div>
      </Modal>

      <Modal
        open={!!editNotice}
        onClose={() => setEditNotice(null)}
        title="Update Bulletin"
        subtitle={`Modifying announcement: ${editNotice?.title}`}
        size="md"
      >
        <div className="p-2">
          {editNotice && (
            <NoticeForm
              notice={editNotice}
              onSubmit={handleEdit}
              isLoading={updateNotice.isPending}
            />
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Announcement"
        description={`This will permanently remove the notice "${deleteTarget?.title}" from the bulletin. This action cannot be reversed.`}
        confirmLabel="Confirm Removal"
        loading={deleteNotice.isPending}
      />
    </div>
  );
}
