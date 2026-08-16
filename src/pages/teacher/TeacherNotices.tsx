import { useState } from "react";
import { Plus, Bell, Megaphone, Calendar, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [open, setOpen] = useState(false);

  const { data: notices = [], isLoading } = useMyNotices();
  const createNotice = useCreateNotice();

  const handleAdd = (data: NoticeFormValues) => {
    createNotice.mutate(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageHeader
          title="Academic Bulletins"
          subtitle="Stay informed with departmental announcements and campus alerts."
          action={
            <button onClick={() => setOpen(true)} className="btn-primary py-3 px-8 shadow-brand-500/10">
              <Plus size={18} />
              Publish Bulletin
            </button>
          }
        />
      </motion.div>

      {/* Notices list */}
      {isLoading ? (
        <div className="card-base bg-white p-8">
          <TableSkeleton rows={4} />
        </div>
      ) : notices.length === 0 ? (
        <div className="card-base bg-white p-12">
          <EmptyState
            icon={Bell}
            title="No Active Bulletins"
            description="Announcements published by the administration or faculty will appear here."
          />
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {notices.map((notice, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={notice.id}
                className={clsx(
                  "card-base p-6 bg-white border-zinc-100 transition-all hover:shadow-md hover:border-brand-100 group",
                  notice.urgent && "border-rose-100 bg-rose-50/30"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex gap-5 flex-1 min-w-0">
                    <div
                      className={clsx(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                        notice.urgent
                          ? "bg-rose-100 text-rose-600 border border-rose-200"
                          : "bg-brand-50 text-brand-600 border border-brand-100"
                      )}
                    >
                      {notice.urgent ? <Megaphone size={22} /> : <Bell size={22} />}
                    </div>
                    <div className="min-w-0 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-medium text-zinc-900 group-hover:text-brand-600 transition-colors">
                          {notice.title}
                        </h3>
                        {notice.urgent && (
                          <span className="text-[10px] font-medium bg-rose-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Urgent
                          </span>
                        )}
                        <Badge
                          label={
                            notice.forRole === "ALL"
                              ? "Campus Wide"
                              : notice.forRole === "TEACHER"
                                ? "Faculty Only"
                                : "Student Body"
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
                      
                      <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
                        {notice.content}
                      </p>

                      <div className="flex items-center gap-4 pt-2 text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-zinc-300" />
                           {notice.createdBy.fullName}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-200" />
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-zinc-300" />
                          {new Date(notice.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                     <button className="flex items-center gap-2 text-xs font-medium text-brand-600 px-4 py-2 rounded-xl hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100">
                        View Details <ArrowRight size={14} />
                     </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Post notice modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Compose Bulletin"
        subtitle="This notice will be broadcast to the selected academic group."
        size="md"
      >
        <div className="p-2">
          <NoticeForm onSubmit={handleAdd} isLoading={createNotice.isPending} />
        </div>
      </Modal>
    </div>
  );
}
