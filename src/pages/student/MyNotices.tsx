import { useState } from "react";
import { Bell } from "lucide-react";
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

  // Filter by search + role
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
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Notices"
        subtitle={`${notices.length} notices · ${urgentCount} urgent`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search notices..."
          className="w-full sm:w-72"
        />

        <div className="flex items-center gap-2">
          {(
            [
              { value: "all", label: "All" },
              { value: "ALL", label: "General" },
              { value: "STUDENT", label: "Students" },
            ] as { value: string; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRoleFilter(value as RoleFilter | "all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium
                          border transition-all duration-200 ${
                            roleFilter === value
                              ? "bg-jade-500/15 border-jade-500/40 text-jade-300"
                              : "border-white/[0.07] text-ink-400 hover:border-white/20"
                          }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices list */}
      {isLoading ? (
        <div className="glass rounded-2xl overflow-hidden">
          <TableSkeleton rows={4} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices found"
          description={
            search
              ? "No notices match your search."
              : "No notices have been posted yet."
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {/* Urgent notices first */}
          {filtered
            .sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
            .map((notice) => (
              <div
                key={notice.id}
                className={clsx(
                  "glass rounded-2xl p-5 transition-all duration-200",
                  "hover:border-white/20",
                  notice.urgent && "border-red-500/20 bg-red-500/3",
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                        notice.urgent
                          ? "bg-red-500/10 border border-red-500/20"
                          : "bg-jade-500/10 border border-jade-500/20",
                      )}
                    >
                      <Bell
                        size={15}
                        className={
                          notice.urgent ? "text-red-400" : "text-jade-400"
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
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
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-ink-500">
                          {notice.author}
                        </span>
                        <span className="text-ink-700">·</span>
                        <span className="text-xs text-ink-500">
                          {new Date(notice.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    label={
                      notice.forRole === "ALL"
                        ? "General"
                        : notice.forRole === "STUDENT"
                          ? "Students"
                          : "Teachers"
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

                {/* Content */}
                <p className="text-sm text-ink-400 leading-relaxed pl-12">
                  {notice.content}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
