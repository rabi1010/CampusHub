import { useState } from "react";
import { Bell, Megaphone, Search, Calendar, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMyNotices } from "../../features/notices/useNotices";
import PageHeader from "../../components/ui/PageHeader";

import clsx from "clsx";
import SearchInput from "../../Component/ui/SearchInput";
import { TableSkeleton } from "../../Component/ui/Skeleton";
import EmptyState from "../../Component/ui/EmptyState";
import Badge from "../../Component/ui/Badge";

type RoleFilter = "ALL" | "STUDENT" | "TEACHER";

export default function MyNotices() {
  const { data: notices = [], isLoading } = useMyNotices();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter | "all">("all");

  const filtered = notices.filter((n) => {
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || n.forRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  const urgentCount = notices.filter((n) => n.urgent).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title="Campus Announcements"
          subtitle={`Reviewing ${notices.length} active notifications · ${urgentCount} require attention.`}
        />
      </motion.div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-500 transition-colors" size={18} />
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search bulletins..."
            className="w-full pl-11 pr-4 py-3 bg-white border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-500/5 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100 w-full md:w-auto">
          {(
            [
              { value: "all", label: "All Broadscasts" },
              { value: "ALL", label: "Campus Wide" },
              { value: "STUDENT", label: "For Students" },
            ] as { value: string; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRoleFilter(value as RoleFilter | "all")}
              className={clsx(
                "flex-1 md:flex-none px-5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap",
                roleFilter === value
                  ? "bg-white text-zinc-900 shadow-sm border border-zinc-100"
                  : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices list */}
      {isLoading ? (
        <div className="card-base bg-white p-8">
          <TableSkeleton rows={4} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-base bg-white p-12">
          <EmptyState
            icon={Bell}
            title="No Bulletins Found"
            description={
              search
                ? "Refine your search parameters to find specific announcements."
                : "The notice board is currently clear of any active broadcasts."
            }
          />
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filtered
              .sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
              .map((notice, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={notice.id}
                  className={clsx(
                    "card-base p-6 bg-white border-zinc-100 transition-all hover:shadow-md hover:border-brand-100 group",
                    notice.urgent && "border-rose-100 bg-rose-50/30 ring-1 ring-rose-500/5"
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
                            <span className="text-[10px] font-medium bg-rose-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                              Urgent Action
                            </span>
                          )}
                          <Badge
                            label={
                              notice.forRole === "ALL"
                                ? "General"
                                : notice.forRole === "STUDENT"
                                  ? "Student Body"
                                  : "Faculty Group"
                            }
                            variant={
                              notice.forRole === "ALL"
                                ? "info"
                                : notice.forRole === "STUDENT"
                                  ? "success"
                                  : "warning"
                            }
                          />
                        </div>

                        <p className="text-sm text-zinc-600 leading-relaxed max-w-4xl">
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
                       <button className="flex items-center gap-2 text-xs font-medium text-brand-600 px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-all border border-zinc-100 hover:border-brand-200">
                          View Bulletin <ArrowRight size={14} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
