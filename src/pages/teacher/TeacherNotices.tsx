import { useState } from "react";
import { Plus, Bell } from "lucide-react";
import {
  useMyNotices,
  useCreateNotice,
} from "../../features/notices/useNotices";
import PageHeader from "../../components/ui/PageHeader";

import type { NoticeFormValues } from "../../features/notices/noticeSchemas";
import clsx from "clsx";
import { TableSkeleton } from "../../Component/ui/Skeleton";
import EmptyState from "../../Component/ui/EmptyState";
import Badge from "../../Component/ui/Badge";
import Modal from "../../Component/ui/Modal";
import NoticeForm from "../../features/notices/NoticeForm";

export default function TeacherNotices() {
  const [addOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: notices = [], isLoading } = useMyNotices();
  const createNotice = useCreateNotice();

  const handleAdd = (data: NoticeFormValues) => {
    createNotice.mutate(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notices"
        subtitle={`${notices.length} notices for you`}
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={16} />
            Post notice
          </button>
        }
      />

      {/* Notices list */}
      {isLoading ? (
        <div className="glass rounded-2xl overflow-hidden">
          <TableSkeleton rows={4} />
        </div>
      ) : notices.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices yet"
          description="Notices posted by admin will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={clsx(
                "glass rounded-2xl p-5 transition-all duration-200",
                "hover:border-white/20",
                notice.urgent && "border-red-500/20 bg-red-500/[0.03]",
              )}
            >
              {/* Notice header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      notice.urgent
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-jade-500/10 border border-jade-500/20",
                    )}
                  >
                    <Bell
                      size={14}
                      className={
                        notice.urgent ? "text-red-400" : "text-jade-400"
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-ink-100">
                        {notice.title}
                      </h3>
                      {notice.urgent && (
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
                      By {notice.author} ·{" "}
                      {new Date(notice.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <Badge
                  label={
                    notice.forRole === "ALL"
                      ? "Everyone"
                      : notice.forRole === "TEACHER"
                        ? "Teachers"
                        : "Students"
                  }
                  variant={
                    notice.forRole === "ALL"
                      ? "info"
                      : notice.forRole === "TEACHER"
                        ? "warning"
                        : "success"
                  }
                />
              </div>

              {/* Notice content */}
              <p
                className="text-sm text-ink-400 leading-relaxed
                            pl-10"
              >
                {notice.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Post notice modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Post a notice"
        subtitle="This will be visible to your students"
        size="md"
      >
        <NoticeForm onSubmit={handleAdd} isLoading={createNotice.isPending} />
      </Modal>
    </div>
  );
}
