import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export default function Pagination({
  page,
  totalPages,
  onPage,
  totalItems,
  pageSize = 10,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build visible page numbers with ellipsis
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems ?? page * pageSize);

  return (
    <div
      className="flex flex-col sm:flex-row items-center
                    justify-between gap-3 pt-4
                    border-t border-white/[0.07]"
    >
      {/* Count */}
      {totalItems !== undefined && (
        <p className="text-xs text-ink-500 font-mono">
          Showing {from}–{to} of {totalItems}
        </p>
      )}

      {/* Pages */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-ink-400
                     hover:text-ink-100 hover:bg-white/5
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="px-1 text-ink-600 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={clsx(
                "w-8 h-8 rounded-lg text-sm font-mono transition-all",
                page === p
                  ? "bg-jade-500/20 text-jade-300 border border-jade-500/30"
                  : "text-ink-400 hover:text-ink-100 hover:bg-white/5",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-ink-400
                     hover:text-ink-100 hover:bg-white/5
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
